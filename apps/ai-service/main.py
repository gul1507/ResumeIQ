import os
import sys
from dotenv import load_dotenv

# Ensure current script directory is in Python path for imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Load environment variables from .env file
load_dotenv(dotenv_path=os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../.env'))
load_dotenv(dotenv_path=os.path.join(os.path.dirname(os.path.abspath(__file__)), '.env'))

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional

from parser import extract_text_from_file
from ner_engine import extract_resume_entities, extract_job_requirements
from scoring import calculate_hybrid_match
from generator import generate_tailored_resume

app = FastAPI(title="ResumeIQ AI Engine", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TextPayload(BaseModel):
    text: str

class ScorePayload(BaseModel):
    resume_text: str
    job_description: str
    candidate_skills: Optional[List[str]] = None
    job_requirements: Optional[List[Dict[str, Any]]] = None
    job_title: Optional[str] = "Target Position"

class TailorPayload(BaseModel):
    original_text: str
    job_description: str
    missing_skills: List[str]

@app.get("/")
def health_check():
    return {"status": "ok", "service": "ResumeIQ AI Service"}

@app.post("/parse")
async def parse_document(file: UploadFile = File(...)):
    contents = await file.read()
    extracted_text = extract_text_from_file(contents, file.filename)
    if not extracted_text:
        raise HTTPException(status_code=400, detail="Could not extract text from uploaded document.")
    entities = extract_resume_entities(extracted_text)
    return {
        "filename": file.filename,
        "rawText": extracted_text,
        "entities": entities
    }

@app.post("/extract-entities")
def extract_entities(payload: TextPayload):
    entities = extract_resume_entities(payload.text)
    return {"entities": entities}

@app.post("/extract-job-requirements")
def extract_job_reqs(payload: TextPayload):
    requirements = extract_job_requirements(payload.text)
    return {"requirements": requirements}

@app.post("/score")
def score_match(payload: ScorePayload):
    result = calculate_hybrid_match(
        resume_text=payload.resume_text,
        job_description=payload.job_description,
        candidate_skills=payload.candidate_skills,
        job_requirements=payload.job_requirements,
        job_title=payload.job_title
    )
    return result

@app.post("/tailor-resume")
def tailor_resume(payload: TailorPayload):
    result = generate_tailored_resume(
        original_text=payload.original_text,
        job_description=payload.job_description,
        missing_skills=payload.missing_skills
    )
    return result

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("AI_SERVICE_PORT", os.getenv("AI_PORT", "8000")))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
