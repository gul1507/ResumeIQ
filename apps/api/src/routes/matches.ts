import { Router, Response } from 'express';
import { prisma } from '../db';
import { authenticate, AuthRequest } from '../middleware/auth';
import { scoreHybridMatch } from '../services/aiService';

const router = Router();

// Calculate Hybrid Match Score (Candidate or Recruiter)
router.post('/score', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { resumeId, jobPostingId, jobDescriptionText } = req.body;
    let resume = null;

    if (resumeId) {
      resume = await prisma.resume.findUnique({
        where: { id: resumeId },
        include: { parsedEntities: true }
      });
    }

    if (!resume) {
      // Find latest resume for current candidate
      resume = await prisma.resume.findFirst({
        where: { candidateId: req.user!.id },
        include: { parsedEntities: true },
        orderBy: { createdAt: 'desc' }
      });
    }

    if (!resume) {
      return res.status(400).json({ error: 'No resume found for scoring.' });
    }

    let jobPosting = null;
    let jobDesc = jobDescriptionText || '';
    let jobReqs: any[] = [];
    let jobTitle = 'Target Role';

    if (jobPostingId) {
      jobPosting = await prisma.jobPosting.findUnique({
        where: { id: jobPostingId },
        include: { requirements: true }
      });
      if (jobPosting) {
        jobDesc = jobPosting.descriptionRaw;
        jobReqs = jobPosting.requirements;
        jobTitle = jobPosting.title;
      }
    }

    if (!jobDesc) {
      return res.status(400).json({ error: 'Job description or Job Posting ID required.' });
    }

    const candidateSkills = resume.parsedEntities
      .filter((e: any) => e.type === 'skill')
      .map((e: any) => e.value);

    // Call Python AI service
    const matchData = await scoreHybridMatch({
      resume_text: resume.rawText,
      job_description: jobDesc,
      candidate_skills: candidateSkills,
      job_requirements: jobReqs,
      job_title: jobTitle
    });

    // Create Match Record in database
    const matchRecord = await prisma.match.create({
      data: {
        resumeId: resume.id,
        jobPostingId: jobPostingId || null,
        lexicalScore: matchData.lexical_score,
        semanticScore: matchData.semantic_score,
        finalScore: matchData.final_score,
        matchedSkills: JSON.stringify(matchData.matched_skills),
        missingSkills: JSON.stringify(matchData.missing_skills),
        explanation: matchData.explanation,
        skillGaps: {
          create: (matchData.skill_gaps || []).map((sg: any) => ({
            skill: sg.skill,
            importance: sg.importance || 'must_have',
            status: sg.status || 'missing',
            suggestionText: sg.suggestionText || `Improve coverage of ${sg.skill}.`
          }))
        }
      },
      include: {
        skillGaps: true,
        resume: {
          include: {
            candidate: {
              select: { id: true, name: true, email: true }
            }
          }
        },
        jobPosting: true
      }
    });

    // Audit log for governance tracking
    await prisma.auditLog.create({
      data: {
        actorId: req.user!.id,
        action: 'MATCH_SCORED',
        targetType: 'MATCH',
        targetId: matchRecord.id,
        metadataJson: JSON.stringify({
          finalScore: matchData.final_score,
          lexicalScore: matchData.lexical_score,
          semanticScore: matchData.semantic_score,
          resumeId: resume.id,
          jobPostingId
        })
      }
    });

    res.json({
      matchId: matchRecord.id,
      resumeId: resume.id,
      jobPostingId: jobPostingId || null,
      lexicalScore: matchData.lexical_score,
      semanticScore: matchData.semantic_score,
      finalScore: matchData.final_score,
      matchedSkills: matchData.matched_skills,
      missingSkills: matchData.missing_skills,
      explanation: matchData.explanation,
      skillGaps: matchRecord.skillGaps,
      createdAt: matchRecord.createdAt
    });
  } catch (err: any) {
    console.error('Match scoring error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get Match Detail by ID
router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const match = await prisma.match.findUnique({
      where: { id: req.params.id },
      include: {
        skillGaps: true,
        resume: {
          include: {
            candidate: { select: { id: true, name: true, email: true } }
          }
        },
        jobPosting: true,
        feedback: true
      }
    });

    if (!match) return res.status(404).json({ error: 'Match result not found' });

    res.json({
      id: match.id,
      resumeId: match.resumeId,
      jobPostingId: match.jobPostingId,
      lexicalScore: match.lexicalScore,
      semanticScore: match.semanticScore,
      finalScore: match.finalScore,
      matchedSkills: JSON.parse(match.matchedSkills || '[]'),
      missingSkills: JSON.parse(match.missingSkills || '[]'),
      explanation: match.explanation,
      skillGaps: match.skillGaps,
      candidateName: match.resume?.candidate?.name || 'Candidate',
      resumeTitle: match.resume?.fileName || 'Resume',
      jobTitle: match.jobPosting?.title || 'Target Job',
      feedbackStatus: match.feedback?.status || 'pending',
      feedbackMessage: match.feedback?.message || null,
      createdAt: match.createdAt
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Recruiter Ranked Candidates View
router.get('/job/:jobPostingId/candidates', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { jobPostingId } = req.params;
    const matches = await prisma.match.findMany({
      where: { jobPostingId },
      include: {
        resume: {
          include: {
            candidate: { select: { id: true, name: true, email: true } }
          }
        },
        skillGaps: true,
        feedback: true
      },
      orderBy: { finalScore: 'desc' }
    });

    const formatted = matches.map(m => ({
      id: m.id,
      resumeId: m.resumeId,
      jobPostingId: m.jobPostingId,
      candidateId: m.resume.candidateId,
      candidateName: m.resume.candidate?.name || m.resume.candidate?.email || 'Anonymous Candidate',
      candidateEmail: m.resume.candidate?.email,
      resumeFileName: m.resume.fileName,
      lexicalScore: m.lexicalScore,
      semanticScore: m.semanticScore,
      finalScore: m.finalScore,
      matchedSkills: JSON.parse(m.matchedSkills || '[]'),
      missingSkills: JSON.parse(m.missingSkills || '[]'),
      explanation: m.explanation,
      skillGaps: m.skillGaps,
      feedbackStatus: m.feedback?.status || 'pending',
      feedbackMessage: m.feedback?.message || null,
      createdAt: m.createdAt
    }));

    res.json(formatted);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
