export type UserRole = 'candidate' | 'recruiter' | 'admin';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  isGuest: boolean;
  name?: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ParsedEntity {
  id?: string;
  type: 'skill' | 'experience' | 'education' | 'contact';
  value: string;
  confidence: number;
  yearsOfExperience?: number;
}

export interface ResumeVersion {
  id: string;
  candidateId: string;
  fileUrl?: string;
  fileName: string;
  fileType: string;
  rawText: string;
  version: number;
  isTailored: boolean;
  parentResumeId?: string;
  parsedEntities: ParsedEntity[];
  createdAt: string;
}

export interface JobRequirement {
  id?: string;
  skill: string;
  importance: 'must_have' | 'nice_to_have';
  confidence?: number;
}

export interface JobPosting {
  id: string;
  recruiterId: string;
  title: string;
  companyName: string;
  location: string;
  descriptionRaw: string;
  requirements: JobRequirement[];
  candidateCount?: number;
  createdAt: string;
}

export interface SkillGap {
  skill: string;
  importance: 'must_have' | 'nice_to_have';
  suggestionText: string;
  status: 'matched' | 'missing';
}

export interface MatchResult {
  id: string;
  resumeId: string;
  jobPostingId: string;
  lexicalScore: number; // 0..100
  semanticScore: number; // 0..100
  finalScore: number; // 0..100
  matchedSkills: string[];
  missingSkills: string[];
  explanation: string;
  skillGaps: SkillGap[];
  candidateName?: string;
  resumeTitle?: string;
  jobTitle?: string;
  feedbackStatus?: 'shortlisted' | 'rejected' | 'feedback_sent' | 'pending';
  createdAt: string;
}

export interface TailoredResumeResult {
  tailoredResumeId: string;
  tailoredText: string;
  beforeAfterDiff: {
    section: string;
    originalText: string;
    tailoredText: string;
    explanation: string;
  }[];
  matchedSkillsAdded: string[];
}

export interface RecruiterFeedback {
  id: string;
  matchId: string;
  recruiterId: string;
  candidateId: string;
  status: 'shortlisted' | 'rejected' | 'feedback_sent';
  message: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorEmail?: string;
  actorRole?: string;
  action: string;
  targetType: string;
  targetId: string;
  metadataJson?: Record<string, any>;
  createdAt: string;
}
