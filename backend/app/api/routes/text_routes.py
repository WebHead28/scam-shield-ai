from fastapi import APIRouter
from pydantic import BaseModel
from app.services.text_analysis.text_pipeline import analyze_text

router = APIRouter()

class TextRequest(BaseModel):
    text: str

@router.post("/analyze-text")
def analyze_text_api(request: TextRequest):
    result = analyze_text(request.text)
    return result
