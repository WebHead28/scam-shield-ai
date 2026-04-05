from fastapi import APIRouter
from pydantic import BaseModel
from app.services.phishing_analysis.phishing_pipeline import analyze_phishing

router = APIRouter()

class TextRequest(BaseModel):
    text: str

@router.post("/analyze-phishing")
def analyze_phishing_api(request: TextRequest):
    return analyze_phishing(request.text)
