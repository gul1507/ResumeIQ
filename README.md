# ResumeIQ — AI-Powered Applicant Tracking & Resume Optimization Platform

ResumeIQ is a full-stack, AI-powered Applicant Tracking and Resume Optimization platform engineered around **explainable hybrid matching** (combining normalized skill lexical overlap and Gemini vector embedding cosine similarity).

---

## 🌟 Key Features

### For Candidates
- **Instant Resume Diagnostics**: Drag-and-drop PDF/DOCX resumes to parse skill NER entities, experience levels, and section breakdowns.
- **Hybrid ATS Compatibility Score**: Real-time arc gauge revealing total score, lexical score, and semantic score against any target Job Description.
- **Skill Gap Analysis**: Must-have vs. nice-to-have skill matching matrix with actionable improvement suggestions.
- **AI Resume Tailoring with Interactive Diff**: Generates tailored versions of bullet points and experience summaries without hallucinating background information, with a side-by-side diff viewer.

### For Recruiters
- **Job Posting & Auto Requirement Extraction**: Create job postings and automatically parse skills into prioritized requirements via Gemini NER.
- **Candidate Ranking Table**: High-density, sortable, filterable candidate grid with quick score metrics.
- **Explainability Panel**: Deep slide-over breakdown detailing why a candidate scored where they did (lexical vs semantic metrics, matched tags, missing tags, and natural language AI summary).
- **Structured Candidate Feedback**: Send status updates (Shortlisted, Rejected, Info Needed) with structured templates directly to candidates.

### For Admins & Governance
- **User Management**: Admin role toggles and user status management.
- **Governance Audit Logs**: Paginated audit trail capturing all scoring, parsing, and ranking events for bias review and compliance tracking.

---

## 📐 Scoring Methodology

$$\text{Final Score} = (0.6 \times \text{Lexical Score}) + (0.4 \times \text{Semantic Score})$$

- **Lexical Score**: Jaccard & overlap index calculated over normalized NER extracted skills (handling paraphrased skills like "React.js" vs "React").
- **Semantic Score**: Cosine similarity between Gemini vector embeddings of resume content and job description requirements.
- **Explainability**: Every score renders an explicit breakdown of matched skills, missing skills, and an AI-generated concise natural language summary.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js >= 18
- Python >= 3.11
- Gemini API Key (set in `.env` as `GEMINI_API_KEY`)

### Quick Setup

1. **Install Dependencies & Initialize DB**:
   ```bash
   npm install
   cd apps/api && npx prisma db push && npm run seed && cd ../..
   ```

2. **Start Python AI Service**:
   ```bash
   cd apps/ai-service
   pip install -r requirements.txt
   python main.py
   ```

3. **Start Web & API Services**:
   ```bash
   npm run dev:api  # Starts API on http://localhost:5000
   npm run dev:web  # Starts Web frontend on http://localhost:3000
   ```

4. **Docker Compose (Optional Production Deployment)**:
   ```bash
   docker-compose up --build
   ```
