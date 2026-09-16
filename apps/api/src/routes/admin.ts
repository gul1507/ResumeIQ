import { Router, Response } from 'express';
import { prisma } from '../db';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth';

const router = Router();

// Get Users List (Admin)
router.get('/users', authenticate, requireRole('admin'), async (req: AuthRequest, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        isGuest: true,
        name: true,
        createdAt: true,
        _count: {
          select: { resumes: true, jobPostings: true, auditLogs: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Update User Role / Status (Admin)
router.patch('/users/:id', authenticate, requireRole('admin'), async (req: AuthRequest, res: Response) => {
  try {
    const { role } = req.body;
    if (!role || !['candidate', 'recruiter', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Valid role (candidate, recruiter, admin) required.' });
    }

    const updated = await prisma.user.update({
      where: { id: req.params.id },
      data: { role },
      select: { id: true, email: true, role: true, isGuest: true, name: true }
    });

    await prisma.auditLog.create({
      data: {
        actorId: req.user!.id,
        action: 'USER_ROLE_UPDATED',
        targetType: 'USER',
        targetId: updated.id,
        metadataJson: JSON.stringify({ newRole: role })
      }
    });

    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Get Paginated Governance Audit Trail (Admin)
router.get('/audit-logs', authenticate, requireRole('admin'), async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string || '1', 10);
    const limit = parseInt(req.query.limit as string || '20', 10);
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        skip,
        take: limit,
        include: {
          actor: { select: { email: true, role: true, name: true } }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.auditLog.count()
    ]);

    const formatted = logs.map(l => ({
      id: l.id,
      actorId: l.actorId,
      actorEmail: l.actor?.email,
      actorRole: l.actor?.role,
      action: l.action,
      targetType: l.targetType,
      targetId: l.targetId,
      metadataJson: l.metadataJson ? JSON.parse(l.metadataJson) : null,
      createdAt: l.createdAt
    }));

    res.json({
      data: formatted,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
