from fastapi import APIRouter
from fastapi.responses import FileResponse
from pydantic import BaseModel
from app.services.report_generation.report_pipeline import generate_report

router = APIRouter()

class ReportRequest(BaseModel):
    input_text: str
    analysis_result: dict

@router.post("/generate-report")
def generate_report_api(request: ReportRequest):

    result = generate_report(request.input_text, request.analysis_result)

    return FileResponse(
        path=result["pdf_path"],
        filename=result["file_name"],
        media_type='application/pdf'
    )
