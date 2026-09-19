import { JobPosting, MatchResult, ResumeVersion } from './types';

export interface DemoPresetResume {
  id: string;
  title: string;
  category: string;
  candidateName: string;
  experienceLevel: string;
  fileName: string;
  fileSize: string;
  rawText: string;
  matchedSkills: string[];
  missingSkills: string[];
}

export const DEMO_PRESET_RESUMES: DemoPresetResume[] = [
  {
    id: 'preset-fullstack-sr',
    title: 'Senior Full-Stack Engineer',
    category: 'Full-Stack / Web Platforms',
    candidateName: 'Alex Rivera',
    experienceLevel: '6+ Years Experience',
    fileName: 'Alex_Rivera_FullStack_Staff.pdf',
    fileSize: '142 KB',
    rawText: `ALEX RIVERA
Senior Full-Stack Software Engineer
alex.rivera@example.com • San Francisco, CA • github.com/arivera • linkedin.com/in/arivera

PROFESSIONAL SUMMARY
Senior Full-Stack Software Engineer with 6+ years building distributed web applications, high-throughput microservices, and reactive frontend architectures. Expert in TypeScript, React, Node.js, GraphQL, PostgreSQL, and AWS cloud infrastructure. Led modernization of core checkout systems processing $45M+ in ARR.

TECHNICAL SKILLS
Languages: TypeScript, JavaScript (ESNext), Python, SQL, Go (Intermediate)
Frontend: React, Next.js, Tailwind CSS, Redux Toolkit, WebSockets, Vite
Backend & APIs: Node.js, Express, NestJS, GraphQL, REST APIs, gRPC
Databases & Cache: PostgreSQL, Redis, MongoDB, DynamoDB
DevOps & Cloud: Docker, Kubernetes, AWS (ECS, S3, RDS, Lambda), GitHub Actions CI/CD

PROFESSIONAL EXPERIENCE

Senior Software Engineer — Veloce Cloud Platforms (2022 – Present)
- Architected enterprise multi-tenant analytics dashboard in React and TypeScript, reducing page interactive latency by 42%.
- Designed distributed Node.js microservices handling 28,000 requests/sec with Redis caching and PostgreSQL read-replicas.
- Implemented automated end-to-end testing and GitHub Actions CI/CD pipelines reducing deployment failure rates from 8% to <0.5%.
- Mentored 4 junior engineers and spearheaded cross-team RFCs for frontend performance standards.

Software Engineer — Nexus Media Labs (2019 – 2022)
- Built real-time collaborative workspace canvas using WebSockets, React, and Canvas API utilized by 120,000 monthly active users.
- Migrated legacy REST services to Apollo GraphQL, cutting payload transfer sizes by 35%.
- Containerized development workflows using Docker Compose, decreasing developer environment spin-up time from 3 hours to 10 minutes.

EDUCATION
B.S. in Computer Science — University of California, Berkeley (2015 – 2019)`,
    matchedSkills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Docker', 'REST APIs', 'GraphQL', 'Vite'],
    missingSkills: ['Kafka', 'Distributed Systems', 'Go', 'Microservices Architecture']
  },
  {
    id: 'preset-aiml-specialist',
    title: 'AI/ML Applications Specialist',
    category: 'GenAI & Applied ML',
    candidateName: 'Dr. Maya Chen',
    experienceLevel: '4+ Years Experience',
    fileName: 'Maya_Chen_Applied_AI_ML.pdf',
    fileSize: '168 KB',
    rawText: `DR. MAYA CHEN
Applied AI & Machine Learning Systems Specialist
maya.chen@example.com • Seattle, WA • huggingface.co/mayachen • linkedin.com/in/mayachen

PROFESSIONAL SUMMARY
Applied AI Engineer specializing in LLM application orchestration, retrieval-augmented generation (RAG) pipelines, and production vector search architectures. Deep expertise in Python, PyTorch, LangChain, FastAPI, Qdrant/Pinecone, and cloud GPU deployment.

TECHNICAL SKILLS
Core AI & ML: Python, PyTorch, Hugging Face Transformers, LangChain, LlamaIndex, OpenAI API, Anthropic SDK
Backend & Data: FastAPI, Pydantic, PostgreSQL, pgvector, Redis, Ray, Celery
Vector Databases: Pinecone, Qdrant, ChromaDB, Weaviate
Cloud & MLOps: AWS SageMaker, Docker, Kubernetes, Weights & Biases, Triton Inference Server

EXPERIENCE

Senior AI Engineer — SynthAI Labs (2022 – Present)
- Engineered hybrid semantic search engine using hybrid BM25 + dense vector embeddings, yielding a 24% boost in retrieval precision.
- Fine-tuned open-source 7B/13B parameter models using LoRA/QLoRA for automated domain contract extraction, lowering API costs by $18,000/mo.
- Designed asynchronous FastAPI microservices serving low-latency streaming completions over server-sent events (SSE).

Machine Learning Engineer — Cognitive Dynamics (2020 – 2022)
- Developed computer vision and text classification pipelines processing 4M+ documents monthly using PyTorch and AWS ECS.
- Built automated evaluation harness monitoring LLM hallucination rates and semantic drift across production prompts.

EDUCATION
Ph.D. in Computer Science (Natural Language Processing) — University of Washington (2016 – 2020)`,
    matchedSkills: ['Python', 'FastAPI', 'Vector DB', 'PyTorch', 'Docker', 'REST APIs', 'PostgreSQL'],
    missingSkills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS']
  },
  {
    id: 'preset-security-devops',
    title: 'Staff Cloud & Security Engineer',
    category: 'Cloud Infrastructure / SecOps',
    candidateName: 'Marcus Vance',
    experienceLevel: '8+ Years Experience',
    fileName: 'Marcus_Vance_Cloud_SecOps.pdf',
    fileSize: '155 KB',
    rawText: `MARCUS VANCE
Staff Cloud Security & Site Reliability Engineer
marcus.vance@example.com • Austin, TX • linkedin.com/in/marcusvance

PROFESSIONAL SUMMARY
Staff Cloud Infrastructure & Security Engineer with 8+ years hardening multi-region AWS environments, orchestrating zero-trust architectures, and automating incident response. Expert in Kubernetes, Terraform, Go, SIEM instrumentation, and CIS/SOC2 compliance.

TECHNICAL SKILLS
Security & Governance: IAM, Threat Detection, SIEM, MITRE ATT&CK, Vulnerability Management, SOC 2 Type II
Cloud & Infra: AWS (EKS, VPC, GuardDuty, KMS), GCP, Terraform, Terragrunt, Docker, Kubernetes
Programming: Go, Python, Bash, SQL, Open Policy Agent (OPA/Rego)
Observability: Datadog, Prometheus, Grafana, OpenTelemetry, Splunk

EXPERIENCE

Staff Security Engineer — Apex FinTech Core (2021 – Present)
- Architected immutable AWS EKS infrastructure protected by Calico network policies and Falco runtime threat detection.
- Built automated vulnerability triage bot in Go integrating with GitHub Security Advisories and Slack webhooks.
- Orchestrated enterprise SOC2 Type II audit completion with zero non-conformity findings.

Senior DevSecOps Engineer — HyperScale Data (2017 – 2021)
- Implemented least-privilege IAM roles across 45 AWS accounts using Terraform and AWS Organizations SCPs.
- Reduced mean-time-to-detect (MTTD) security incidents from 4 hours to 8 minutes via automated SIEM alerts.

EDUCATION
B.S. in Cybersecurity & Information Systems — University of Texas at Austin (2013 – 2017)`,
    matchedSkills: ['Kubernetes', 'AWS', 'IAM', 'Threat Detection', 'Go', 'Python', 'Terraform', 'Docker'],
    missingSkills: ['SIEM', 'MITRE ATT&CK', 'Incident Response', 'Vulnerability Assessment']
  }
];

export const DEMO_JOBS: JobPosting[] = [
  {
    id: 'job-stripe-backend',
    recruiterId: 'recruiter-stripe-1',
    title: 'Senior Backend & Distributed Systems Engineer',
    companyName: 'Stripe',
    location: 'San Francisco, CA / Remote (US)',
    descriptionRaw: `Stripe is looking for a Senior Backend & Distributed Systems Engineer to build mission-critical payment processing primitives. You will architect fault-tolerant distributed services handling millions of transactions every hour with five-nines reliability.

Requirements:
- 5+ years of software engineering experience with Node.js, Go, or Python.
- Proven experience with distributed systems, microservices architecture, and message queues (Kafka, RabbitMQ).
- Deep knowledge of relational databases (PostgreSQL, MySQL) and in-memory caches (Redis).
- Hands-on experience with containerization (Docker, Kubernetes) and AWS cloud infrastructure.
- Strong grounding in API design principles (REST, gRPC, idempotency, rate-limiting).`,
    requirements: [
      { skill: 'Node.js', importance: 'must_have', confidence: 0.98 },
      { skill: 'Distributed Systems', importance: 'must_have', confidence: 0.95 },
      { skill: 'PostgreSQL', importance: 'must_have', confidence: 0.95 },
      { skill: 'Kafka', importance: 'must_have', confidence: 0.90 },
      { skill: 'Redis', importance: 'must_have', confidence: 0.92 },
      { skill: 'Go', importance: 'nice_to_have', confidence: 0.85 },
      { skill: 'Docker', importance: 'must_have', confidence: 0.90 },
      { skill: 'Microservices Architecture', importance: 'must_have', confidence: 0.92 },
      { skill: 'REST APIs', importance: 'must_have', confidence: 0.88 },
      { skill: 'AWS', importance: 'nice_to_have', confidence: 0.86 }
    ],
    candidateCount: 14,
    createdAt: new Date().toISOString()
  },
  {
    id: 'job-openai-fullstack-ai',
    recruiterId: 'recruiter-openai-1',
    title: 'Full-Stack AI Application Developer',
    companyName: 'OpenAI',
    location: 'San Francisco, CA / Hybrid',
    descriptionRaw: `Join OpenAI to build next-generation interfaces and runtime tooling for multimodal AI intelligence. You will collaborate with research and product engineers to ship high-polish, reactive interfaces backed by streaming vector APIs.

Requirements:
- Strong proficiency with TypeScript, React, Next.js, and modern CSS (Tailwind CSS).
- Solid experience building and deploying backend services in Python (FastAPI) or Node.js.
- Familiarity with vector databases (Pinecone, Qdrant, ChromaDB) and retrieval-augmented generation (RAG).
- Experience integrating LLM APIs and designing streaming server-sent events (SSE) workflows.
- Eye for design craft, responsive typography, and micro-interactions.`,
    requirements: [
      { skill: 'TypeScript', importance: 'must_have', confidence: 0.98 },
      { skill: 'React', importance: 'must_have', confidence: 0.98 },
      { skill: 'Python', importance: 'must_have', confidence: 0.95 },
      { skill: 'FastAPI', importance: 'must_have', confidence: 0.92 },
      { skill: 'Vector DB', importance: 'must_have', confidence: 0.90 },
      { skill: 'Tailwind CSS', importance: 'nice_to_have', confidence: 0.88 },
      { skill: 'Next.js', importance: 'nice_to_have', confidence: 0.85 },
      { skill: 'Docker', importance: 'nice_to_have', confidence: 0.82 }
    ],
    candidateCount: 22,
    createdAt: new Date().toISOString()
  },
  {
    id: 'job-datadog-secops',
    recruiterId: 'recruiter-datadog-1',
    title: 'Staff Security Operations & Cloud Hardening Engineer',
    companyName: 'Datadog',
    location: 'New York, NY / Remote (US/EU)',
    descriptionRaw: `Datadog Security is seeking a Staff Security Operations Engineer to protect our global multi-cloud platform. You will lead threat detection, SIEM automation, automated vulnerability assessment, and cloud security posture hardening.

Requirements:
- 7+ years in Cloud Security, DevSecOps, or Security Operations.
- Deep expertise in AWS/GCP cloud IAM, GuardDuty, and Kubernetes security.
- Experience with SIEM tools, automated alert triage, and incident response playbooks.
- Proficiency in Python, Go, or Bash for automated defensive security tooling.
- Thorough understanding of MITRE ATT&CK framework and vulnerability management lifecycle.`,
    requirements: [
      { skill: 'Kubernetes', importance: 'must_have', confidence: 0.97 },
      { skill: 'AWS', importance: 'must_have', confidence: 0.96 },
      { skill: 'Threat Detection', importance: 'must_have', confidence: 0.94 },
      { skill: 'IAM', importance: 'must_have', confidence: 0.92 },
      { skill: 'SIEM', importance: 'must_have', confidence: 0.90 },
      { skill: 'Incident Response', importance: 'must_have', confidence: 0.88 },
      { skill: 'Python', importance: 'nice_to_have', confidence: 0.85 },
      { skill: 'Go', importance: 'nice_to_have', confidence: 0.85 }
    ],
    candidateCount: 9,
    createdAt: new Date().toISOString()
  }
];

export const generateSimulatedMatch = (
  presetResume: DemoPresetResume,
  job: JobPosting
): MatchResult => {
  const reqSkills = job.requirements.map(r => r.skill);
  const matched = reqSkills.filter(s => 
    presetResume.rawText.toLowerCase().includes(s.toLowerCase()) || 
    presetResume.matchedSkills.some(ms => ms.toLowerCase() === s.toLowerCase())
  );
  const missing = reqSkills.filter(s => !matched.includes(s));

  const lexicalScore = Math.min(100, Math.round(((matched.length / Math.max(1, reqSkills.length)) * 100) * 10) / 10);
  const semanticScore = Math.min(100, Math.round((lexicalScore * 0.85 + 14.5) * 10) / 10);
  const finalScore = Math.round((0.6 * lexicalScore + 0.4 * semanticScore) * 10) / 10;

  const skillGaps = missing.map((skill, idx) => ({
    id: `gap-${idx}`,
    skill,
    importance: (idx % 2 === 0 ? 'must_have' : 'nice_to_have') as 'must_have' | 'nice_to_have',
    suggestionText: `Incorporate verified production experience or projects utilizing ${skill} to satisfy core requisition criteria.`,
    status: 'missing' as const
  }));

  const matchedGaps = matched.map((skill, idx) => ({
    id: `matched-${idx}`,
    skill,
    importance: 'must_have' as const,
    suggestionText: `Candidate demonstrates strong, verified keyword density and contextual usage for ${skill}.`,
    status: 'matched' as const
  }));

  const explanation = `Evaluated candidate '${presetResume.candidateName}' against requisition '${job.title}' at ${job.companyName}. The hybrid matching model calculated an overall ATS match score of ${finalScore}% (Lexical Overlap: ${lexicalScore}%, Semantic Similarity: ${semanticScore}%). Strong coverage was identified in ${matched.slice(0, 4).join(', ')}. Key areas for improvement before submission include targeted keyword articulation for ${missing.slice(0, 3).join(', ')}.`;

  return {
    id: `match-sim-${Date.now()}`,
    resumeId: presetResume.id,
    jobPostingId: job.id,
    candidateId: `cand-${presetResume.id}`,
    candidateName: presetResume.candidateName,
    candidateEmail: `${presetResume.candidateName.toLowerCase().replace(/[^a-z]/g, '.')}@example.com`,
    resumeFileName: presetResume.fileName,
    lexicalScore,
    semanticScore,
    finalScore,
    matchedSkills: matched,
    missingSkills: missing,
    explanation,
    skillGaps: [...skillGaps, ...matchedGaps],
    jobTitle: job.title,
    feedbackStatus: finalScore >= 80 ? 'shortlisted' : (finalScore >= 65 ? 'pending' : 'under_review') as any,
    createdAt: new Date().toISOString()
  };
};

export const generateSimulatedTailoredResult = (
  match: MatchResult,
  targetJob: JobPosting
) => {
  const missingToInject = match.missingSkills.slice(0, 4);

  const diffItems = [
    {
      section: 'Professional Summary',
      originalText: 'Senior Full-Stack Software Engineer with 6+ years building web applications and reactive frontend architectures.',
      tailoredText: `Senior Full-Stack Software Engineer with 6+ years architecting high-throughput distributed systems and enterprise web platforms (${missingToInject.slice(0, 2).join(', ')}).`,
      explanation: `Explicitly contextualized software architecture background to address ${missingToInject.slice(0, 2).join(' and ')} without misrepresenting domain tenure.`
    },
    {
      section: 'Professional Experience — Veloce Cloud Platforms',
      originalText: 'Architected enterprise analytics dashboard in React and TypeScript, reducing page interactive latency by 42%.',
      tailoredText: `Architected distributed analytics dashboard in React & TypeScript, designing event pipelines and microservice connectors (${missingToInject[0] || 'Distributed Systems'}) to improve latency by 42%.`,
      explanation: `Emphasized architectural integration points targeting requisition requirements.`
    },
    {
      section: 'Professional Experience — Core Infrastructure',
      originalText: 'Designed distributed Node.js services handling 28,000 requests/sec with Redis caching and PostgreSQL read-replicas.',
      tailoredText: `Engineered high-concurrency microservice APIs with Redis caching, PostgreSQL read-replicas, and stream queues (${missingToInject[1] || 'Kafka'}) maintaining 99.99% uptime.`,
      explanation: `Highlighted stream queuing patterns to directly match target backend job specifications.`
    }
  ];

  const tailoredText = `ALEX RIVERA (AI TAILORED FOR ${targetJob.title.toUpperCase()} AT ${targetJob.companyName.toUpperCase()})
Senior Software Engineer • alex.rivera@example.com • San Francisco, CA

PROFESSIONAL SUMMARY:
Senior Software Engineer with 6+ years of specialized experience architecting scalable distributed systems, high-concurrency microservices, and reactive platforms (${missingToInject.join(', ')}). Proven track record delivering 99.99% service availability at scale.

OPTIMIZED SKILLS:
${[...match.matchedSkills, ...missingToInject].join(' • ')}

REFINED PROFESSIONAL EXPERIENCE:
- Architected distributed analytics dashboard in React & TypeScript, designing event pipelines and microservice connectors (${missingToInject[0] || 'Distributed Systems'}) to improve latency by 42%.
- Engineered high-concurrency microservice APIs with Redis caching, PostgreSQL read-replicas, and stream queues (${missingToInject[1] || 'Kafka'}) maintaining 99.99% uptime.
- Implemented automated CI/CD deployment pipelines reducing operational failure rates from 8% to <0.5%.

Integrity Note: Generated via ResumeIQ Hybrid ATS AI Optimization Engine without unearned titles, false companies, or fabricated credentials.`;

  return {
    tailoredResume: {
      id: `tailored-res-${Date.now()}`,
      candidateId: match.candidateId,
      fileName: `Tailored_${match.resumeFileName}`,
      fileType: 'application/pdf',
      rawText: tailoredText,
      version: 2,
      isTailored: true,
      createdAt: new Date().toISOString()
    },
    tailoredText,
    beforeAfterDiff: diffItems,
    matchedSkillsAdded: missingToInject
  };
};

export const DEMO_RECRUITER_CANDIDATES: MatchResult[] = [
  {
    id: 'cand-rec-1',
    resumeId: 'res-cand-1',
    candidateName: 'Elena Rostova',
    candidateEmail: 'elena.rostova@example.com',
    resumeFileName: 'Elena_Rostova_Staff_Distributed.pdf',
    lexicalScore: 92.0,
    semanticScore: 89.5,
    finalScore: 91.0,
    matchedSkills: ['Node.js', 'Distributed Systems', 'PostgreSQL', 'Kafka', 'Redis', 'Docker', 'Microservices Architecture', 'AWS'],
    missingSkills: ['Go'],
    explanation: 'Exceptional alignment across all core backend distributed systems requirements. Demonstrates deep hands-on expertise with Kafka streaming, Redis clusters, and multi-region AWS architectures.',
    skillGaps: [],
    jobTitle: 'Senior Backend & Distributed Systems Engineer',
    feedbackStatus: 'shortlisted',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    id: 'cand-rec-2',
    resumeId: 'res-cand-2',
    candidateName: 'Derrick Vance',
    candidateEmail: 'derrick.vance@example.com',
    resumeFileName: 'Derrick_Vance_Senior_Cloud.pdf',
    lexicalScore: 85.0,
    semanticScore: 82.0,
    finalScore: 83.8,
    matchedSkills: ['PostgreSQL', 'Docker', 'Microservices Architecture', 'REST APIs', 'AWS', 'Redis'],
    missingSkills: ['Kafka', 'Distributed Systems'],
    explanation: 'Strong full-stack and cloud backend foundation with reliable PostgreSQL and containerization experience. Moderate gap in high-throughput distributed event streaming.',
    skillGaps: [],
    jobTitle: 'Senior Backend & Distributed Systems Engineer',
    feedbackStatus: 'pending',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString()
  },
  {
    id: 'cand-rec-3',
    resumeId: 'res-cand-3',
    candidateName: 'Kavita Patel',
    candidateEmail: 'kavita.patel@example.com',
    resumeFileName: 'Kavita_Patel_AI_FullStack.pdf',
    lexicalScore: 78.0,
    semanticScore: 84.0,
    finalScore: 80.4,
    matchedSkills: ['Node.js', 'PostgreSQL', 'Docker', 'REST APIs'],
    missingSkills: ['Kafka', 'Go', 'Redis'],
    explanation: 'Solid API engineering and data modeling background. Demonstrates fast adaptability and strong semantic relevance to microservice systems.',
    skillGaps: [],
    jobTitle: 'Senior Backend & Distributed Systems Engineer',
    feedbackStatus: 'pending',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  {
    id: 'cand-rec-4',
    resumeId: 'res-cand-4',
    candidateName: 'Lucas Morales',
    candidateEmail: 'lucas.morales@example.com',
    resumeFileName: 'Lucas_Morales_Frontend_Junior.pdf',
    lexicalScore: 48.0,
    semanticScore: 56.0,
    finalScore: 51.2,
    matchedSkills: ['Docker', 'REST APIs'],
    missingSkills: ['Kafka', 'Distributed Systems', 'PostgreSQL', 'Redis', 'Microservices Architecture'],
    explanation: 'Primary expertise lies in client-side applications. Significant gap in distributed backend primitives and high-load databases.',
    skillGaps: [],
    jobTitle: 'Senior Backend & Distributed Systems Engineer',
    feedbackStatus: 'rejected',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString()
  }
];
