import { Router, Response } from 'express';
import { prisma } from '../db';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth';

const router = Router();

// Recruiter sends feedback to Candidate
router.post('/', authenticate, requireRole('recruiter', 'admin'), async (req: AuthRequest, res: Response) => {
  try {
    const { matchId, status, message } = req.body;
    if (!matchId || !status || !message) {
      return res.status(400).json({ error: 'Match ID, status, and feedback message are required.' });
    }

    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: { resume: true }
    });

    if (!match) return res.status(404).json({ error: 'Match record not found' });

    const recruiterId = req.user!.id;
    const candidateId = match.resume.candidateId;

    const feedback = await prisma.feedback.upsert({
      where: { matchId },
      update: {
        status,
        message,
        recruiterId
      },
      create: {
        matchId,
        recruiterId,
        candidateId,
        status,
        message
      }
    });

    // Audit log for candidate feedback action
    await prisma.auditLog.create({
      data: {
        actorId: recruiterId,
        action: 'FEEDBACK_SENT',
        targetType: 'FEEDBACK',
        targetId: feedback.id,
        metadataJson: JSON.stringify({ matchId, candidateId, status })
      }
    });

    res.json(feedback);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Candidate fetches received feedback inbox
router.get('/my-feedback', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const candidateId = req.user!.id;
    const feedbacks = await prisma.feedback.findMany({
      where: { candidateId },
      include: {
        recruiter: { select: { name: true, email: true } },
        match: {
          include: { jobPosting: { select: { title: true, companyName: true } } }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(feedbacks);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
