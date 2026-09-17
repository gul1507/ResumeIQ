import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding ResumeIQ database with demo users, jobs, resumes, and matches...');

  // Clean existing tables
  await prisma.auditLog.deleteMany();
  await prisma.feedback.deleteMany();
  await prisma.skillGap.deleteMany();
  await prisma.match.deleteMany();
  await prisma.jobRequirement.deleteMany();
  await prisma.jobPosting.deleteMany();
  await prisma.parsedEntity.deleteMany();
  await prisma.resume.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('password123', 10);
  const demoPasswordHash = await bcrypt.hash('demo1234', 10);

  // 1. Create Users
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@resumeiq.com',
      name: 'System Administrator',
      passwordHash,
      role: 'admin'
    }
  });

  const demoAdminUser = await prisma.user.create({
    data: {
      email: 'admin@demo.com',
      name: 'Demo Admin',
      passwordHash: demoPasswordHash,
      role: 'admin'
    }
  });

  const recruiterUser = await prisma.user.create({
    data: {
      email: 'recruiter@techcorp.io',
      name: 'Sarah Connor (Talent Lead)',
      passwordHash,
      role: 'recruiter'
    }
  });

  const demoRecruiterUser = await prisma.user.create({
    data: {
      email: 'recruiter@demo.com',
      name: 'Demo Recruiter',
      passwordHash: demoPasswordHash,
      role: 'recruiter'
    }
  });

  const candidate1 = await prisma.user.create({
    data: {
      email: 'alex.dev@gmail.com',
      name: 'Alex Rivera',
      passwordHash,
      role: 'candidate'
    }
  });

  const demoCandidateUser = await prisma.user.create({
    data: {
      email: 'candidate@demo.com',
      name: 'Demo Candidate',
      passwordHash: demoPasswordHash,
      role: 'candidate'
    }
  });

  const candidate2 = await prisma.user.create({
    data: {
      email: 'priya.sharma@outlook.com',
      name: 'Priya Sharma',
      passwordHash,
      role: 'candidate'
    }
  });

  const candidate3 = await prisma.user.create({
    data: {
      email: 'marcus.vance@tech.org',
      name: 'Marcus Vance',
      passwordHash,
      role: 'candidate'
    }
  });

  console.log('Created demo users.');

  // 2. Create Job Posting
  const jobPosting = await prisma.jobPosting.create({
    data: {
      recruiterId: recruiterUser.id,
      title: 'Senior Full Stack Engineer (React & Node)',
      companyName: 'TechCorp Innovation Labs',
      location: 'Remote / San Francisco',
      descriptionRaw: `We are searching for a Senior Full Stack Engineer proficient in React, TypeScript, Node.js, Express, and PostgreSQL. 
Experience with Docker, REST API architecture, microservices, and AI integrations (Gemini/OpenAI) is highly preferred. 
Must possess strong problem solving capabilities, clean code standards, and agile sprint collaboration.`,
      requirements: {
        create: [
          { skill: 'React', importance: 'must_have', confidence: 0.98 },
          { skill: 'TypeScript', importance: 'must_have', confidence: 0.95 },
          { skill: 'Node.js', importance: 'must_have', confidence: 0.95 },
          { skill: 'PostgreSQL', importance: 'must_have', confidence: 0.90 },
          { skill: 'Docker', importance: 'nice_to_have', confidence: 0.85 },
          { skill: 'REST API', importance: 'must_have', confidence: 0.92 },
          { skill: 'AI Integration', importance: 'nice_to_have', confidence: 0.80 }
        ]
      }
    }
  });

  // 3. Create Resumes
  const alexResume = await prisma.resume.create({
    data: {
      candidateId: candidate1.id,
      fileName: 'Alex_Rivera_FullStack_Resume.pdf',
      fileType: 'application/pdf',
      rawText: `Alex Rivera - Senior Full Stack Engineer
Summary: Experienced software engineer with 6 years building modern React, TypeScript, and Node.js applications with PostgreSQL backends.
Skills: React, TypeScript, Node.js, Express, PostgreSQL, REST API, Git, Tailwind CSS, Jest, GraphQL.
Experience:
- Staff Engineer at CloudScale: Spearheaded React and Node API migration scaling to 500k DAU.
- Full Stack Developer at WebWorks: Designed REST APIs, optimized Postgres queries, and wrote automated Vitest suites.`,
      parsedEntities: {
        create: [
          { type: 'skill', value: 'React', confidence: 0.98, yearsOfExperience: 6 },
          { type: 'skill', value: 'TypeScript', confidence: 0.95, yearsOfExperience: 5 },
          { type: 'skill', value: 'Node.js', confidence: 0.95, yearsOfExperience: 6 },
          { type: 'skill', value: 'PostgreSQL', confidence: 0.92, yearsOfExperience: 4 },
          { type: 'skill', value: 'REST API', confidence: 0.95, yearsOfExperience: 6 },
          { type: 'skill', value: 'Tailwind CSS', confidence: 0.90, yearsOfExperience: 3 }
        ]
      }
    }
  });

  const demoResume = await prisma.resume.create({
    data: {
      candidateId: demoCandidateUser.id,
      fileName: 'Demo_Candidate_FullStack_Resume.pdf',
      fileType: 'application/pdf',
      rawText: `Jordan Taylor - Senior Software Engineer
Summary: Experienced software engineer with 6 years building modern React, TypeScript, and Node.js applications with PostgreSQL backends.
Skills: React, TypeScript, Node.js, Express, PostgreSQL, REST API, Git, Tailwind CSS, Jest, GraphQL.
Experience:
- Staff Engineer at CloudScale: Spearheaded React and Node API migration scaling to 500k DAU.
- Full Stack Developer at WebWorks: Designed REST APIs, optimized Postgres queries, and wrote automated Vitest suites.`,
      parsedEntities: {
        create: [
          { type: 'skill', value: 'React', confidence: 0.98, yearsOfExperience: 6 },
          { type: 'skill', value: 'TypeScript', confidence: 0.95, yearsOfExperience: 5 },
          { type: 'skill', value: 'Node.js', confidence: 0.95, yearsOfExperience: 6 },
          { type: 'skill', value: 'PostgreSQL', confidence: 0.92, yearsOfExperience: 4 },
          { type: 'skill', value: 'REST API', confidence: 0.95, yearsOfExperience: 6 },
          { type: 'skill', value: 'Tailwind CSS', confidence: 0.90, yearsOfExperience: 3 }
        ]
      }
    }
  });

  const priyaResume = await prisma.resume.create({
    data: {
      candidateId: candidate2.id,
      fileName: 'Priya_Sharma_Lead_Developer.docx',
      fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      rawText: `Priya Sharma - Lead Systems & AI Engineer
Summary: Tech lead with 8+ years experience in Python, FastAPI, React, TypeScript, Docker, Kubernetes, and LLM integrations.
Skills: React, TypeScript, Python, FastAPI, Docker, Kubernetes, PostgreSQL, AI Integration, Node.js.
Experience:
- Tech Lead at NextGen AI: Built Python & FastAPI generative AI services with React frontend dashboards.
- Cloud Engineer at DevOps Inc: Containerized microservices using Docker and deployed on AWS EKS.`,
      parsedEntities: {
        create: [
          { type: 'skill', value: 'React', confidence: 0.95, yearsOfExperience: 5 },
          { type: 'skill', value: 'TypeScript', confidence: 0.90, yearsOfExperience: 4 },
          { type: 'skill', value: 'Node.js', confidence: 0.85, yearsOfExperience: 3 },
          { type: 'skill', value: 'PostgreSQL', confidence: 0.90, yearsOfExperience: 6 },
          { type: 'skill', value: 'Docker', confidence: 0.98, yearsOfExperience: 6 },
          { type: 'skill', value: 'AI Integration', confidence: 0.95, yearsOfExperience: 3 }
        ]
      }
    }
  });

  const marcusResume = await prisma.resume.create({
    data: {
      candidateId: candidate3.id,
      fileName: 'Marcus_Vance_Frontend_Dev.pdf',
      fileType: 'application/pdf',
      rawText: `Marcus Vance - Frontend Developer
Summary: Creative frontend developer specializing in Vue.js, HTML5, CSS3, and JavaScript UI work.
Skills: JavaScript, Vue.js, HTML5, CSS3, Figma, Sass, Webpack.
Experience:
- UI Engineer at DesignStudio: Built customer web layouts using HTML, CSS, and Vue.js.`,
      parsedEntities: {
        create: [
          { type: 'skill', value: 'JavaScript', confidence: 0.90, yearsOfExperience: 3 },
          { type: 'skill', value: 'Vue.js', confidence: 0.95, yearsOfExperience: 3 },
          { type: 'skill', value: 'HTML5', confidence: 0.98, yearsOfExperience: 4 },
          { type: 'skill', value: 'CSS3', confidence: 0.98, yearsOfExperience: 4 }
        ]
      }
    }
  });

  // 4. Create Match Results & Skill Gaps
  const alexMatch = await prisma.match.create({
    data: {
      resumeId: alexResume.id,
      jobPostingId: jobPosting.id,
      lexicalScore: 92.5,
      semanticScore: 89.0,
      finalScore: 91.1,
      matchedSkills: JSON.stringify(['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'REST API']),
      missingSkills: JSON.stringify(['Docker', 'AI Integration']),
      explanation: 'Candidate shows exceptional alignment with core mandatory skill set (React, TypeScript, Node.js, Postgres). High lexical matching rate (92.5%) complemented by strong semantic contextual fit.',
      skillGaps: {
        create: [
          { skill: 'React', importance: 'must_have', status: 'matched', suggestionText: 'Solid 6-year demonstrated history in React.' },
          { skill: 'TypeScript', importance: 'must_have', status: 'matched', suggestionText: 'Strong type safety and architecture background.' },
          { skill: 'Docker', importance: 'nice_to_have', status: 'missing', suggestionText: 'Adding containerization concepts will elevate candidate profile to top tier.' }
        ]
      }
    }
  });

  const demoMatch = await prisma.match.create({
    data: {
      resumeId: demoResume.id,
      jobPostingId: jobPosting.id,
      lexicalScore: 92.5,
      semanticScore: 89.0,
      finalScore: 91.1,
      matchedSkills: JSON.stringify(['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'REST API']),
      missingSkills: JSON.stringify(['Docker', 'AI Integration']),
      explanation: 'Candidate shows exceptional alignment with core mandatory skill set (React, TypeScript, Node.js, Postgres). High lexical matching rate (92.5%) complemented by strong semantic contextual fit.',
      skillGaps: {
        create: [
          { skill: 'React', importance: 'must_have', status: 'matched', suggestionText: 'Solid 6-year demonstrated history in React.' },
          { skill: 'TypeScript', importance: 'must_have', status: 'matched', suggestionText: 'Strong type safety and architecture background.' },
          { skill: 'Docker', importance: 'nice_to_have', status: 'missing', suggestionText: 'Adding containerization concepts will elevate candidate profile to top tier.' }
        ]
      }
    }
  });

  const priyaMatch = await prisma.match.create({
    data: {
      resumeId: priyaResume.id,
      jobPostingId: jobPosting.id,
      lexicalScore: 96.0,
      semanticScore: 94.5,
      finalScore: 95.4,
      matchedSkills: JSON.stringify(['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'AI Integration', 'REST API']),
      missingSkills: JSON.stringify([]),
      explanation: 'Top tier candidate with complete coverage across both mandatory requirements and optional AI/Docker qualifications. Exceptional semantic similarity.',
      skillGaps: {
        create: [
          { skill: 'React', importance: 'must_have', status: 'matched', suggestionText: 'Full stack mastery.' },
          { skill: 'Docker', importance: 'nice_to_have', status: 'matched', suggestionText: 'Containerization expertise matches team goals.' }
        ]
      }
    }
  });

  const marcusMatch = await prisma.match.create({
    data: {
      resumeId: marcusResume.id,
      jobPostingId: jobPosting.id,
      lexicalScore: 35.0,
      semanticScore: 42.0,
      finalScore: 37.8,
      matchedSkills: JSON.stringify(['JavaScript']),
      missingSkills: JSON.stringify(['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'REST API']),
      explanation: 'Weak alignment. Candidate primary background is focused on Vue.js frontend without backend Node/Postgres stack experience.',
      skillGaps: {
        create: [
          { skill: 'React', importance: 'must_have', status: 'missing', suggestionText: 'Critical missing mandatory framework.' },
          { skill: 'Node.js', importance: 'must_have', status: 'missing', suggestionText: 'Missing backend runtime experience.' }
        ]
      }
    }
  });

  // 5. Create Recruiter Feedback
  await prisma.feedback.create({
    data: {
      matchId: priyaMatch.id,
      recruiterId: recruiterUser.id,
      candidateId: candidate2.id,
      status: 'shortlisted',
      message: 'Impressive profile! We would love to invite you for an initial technical screening for the Senior Full Stack role.'
    }
  });

  // 6. Create Governance Audit Logs
  await prisma.auditLog.createMany({
    data: [
      { actorId: candidate1.id, action: 'RESUME_UPLOADED', targetType: 'RESUME', targetId: alexResume.id, metadataJson: JSON.stringify({ fileName: alexResume.fileName }) },
      { actorId: candidate2.id, action: 'RESUME_UPLOADED', targetType: 'RESUME', targetId: priyaResume.id, metadataJson: JSON.stringify({ fileName: priyaResume.fileName }) },
      { actorId: recruiterUser.id, action: 'JOB_POSTED', targetType: 'JOB_POSTING', targetId: jobPosting.id, metadataJson: JSON.stringify({ title: jobPosting.title }) },
      { actorId: recruiterUser.id, action: 'MATCH_SCORED', targetType: 'MATCH', targetId: alexMatch.id, metadataJson: JSON.stringify({ score: 91.1 }) },
      { actorId: recruiterUser.id, action: 'MATCH_SCORED', targetType: 'MATCH', targetId: priyaMatch.id, metadataJson: JSON.stringify({ score: 95.4 }) },
      { actorId: recruiterUser.id, action: 'FEEDBACK_SENT', targetType: 'FEEDBACK', targetId: 'fb-1', metadataJson: JSON.stringify({ status: 'shortlisted', candidateId: candidate2.id }) }
    ]
  });

  console.log('Successfully seeded database with complete demo ecosystem!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
