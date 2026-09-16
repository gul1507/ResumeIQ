import { Router, Response } from 'express';
import { prisma } from '../db';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth';
import { extractJobRequirements } from '../services/aiService';

const router = Router();

// Post a new Job Posting (Recruiters)
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { title, companyName, location, descriptionRaw, customRequirements } = req.body;
    if (!title || !descriptionRaw) {
      return res.status(400).json({ error: 'Job title and description are required.' });
    }

    const recruiterId = req.user!.id;
    let requirementsData = customRequirements;

    if (!requirementsData || !Array.isArray(requirementsData) || requirementsData.length === 0) {
      const extracted = await extractJobRequirements(descriptionRaw);
      requirementsData = extracted.requirements || [];
    }

    const job = await prisma.jobPosting.create({
      data: {
        recruiterId,
        title,
        companyName: companyName || 'Company',
        location: location || 'Remote',
        descriptionRaw,
        requirements: {
          create: requirementsData.map((r: any) => ({
            skill: r.skill,
            importance: r.importance || 'must_have',
            confidence: r.confidence || 0.9
          }))
        }
      },
      include: {
        requirements: true
      }
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        actorId: recruiterId,
        action: 'JOB_POSTED',
        targetType: 'JOB_POSTING',
        targetId: job.id,
        metadataJson: JSON.stringify({ title: job.title, requirementCount: job.requirements.length })
      }
    });

    res.json(job);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Auto-extract requirements from JD text (before posting)
router.post('/extract-requirements', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { descriptionRaw } = req.body;
    if (!descriptionRaw) return res.status(400).json({ error: 'Job description text required.' });
    const extracted = await extractJobRequirements(descriptionRaw);
    res.json(extracted);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// List all Job Postings (Open to candidates & recruiters)
router.get('/', async (_req, res: Response) => {
  try {
    const jobs = await prisma.jobPosting.findMany({
      include: {
        requirements: true,
        _count: { select: { matches: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    const formatted = jobs.map(j => ({
      ...j,
      candidateCount: j._count.matches
    }));

    res.json(formatted);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Get Job Posting by ID
router.get('/:id', async (req, res: Response) => {
  try {
    const job = await prisma.jobPosting.findUnique({
      where: { id: req.params.id },
      include: { requirements: true }
    });
    if (!job) return res.status(404).json({ error: 'Job posting not found' });
    res.json(job);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
