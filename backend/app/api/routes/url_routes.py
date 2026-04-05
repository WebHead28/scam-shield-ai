from fastapi import APIRouter
from pydantic import BaseModel
from app.services.url_analysis.url_pipeline import analyze_url

router = APIRouter()

class URLRequest(BaseModel):
    url: str

@router.post("/analyze-url")
def analyze_url_api(request: URLRequest):
    return analyze_url(request.url)
