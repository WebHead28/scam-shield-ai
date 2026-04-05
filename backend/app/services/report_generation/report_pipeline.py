import os
import uuid
import tempfile  # FIX: use system temp dir — always writable in Docker and CI

from app.config.settings import OPENAI_API_KEY
from openai import OpenAI
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet

client = OpenAI(api_key=OPENAI_API_KEY)


def generate_report(input_text: str, analysis_result: dict):

    # ---------------- LLM REPORT ---------------- #
    prompt = f"""
You are a cybersecurity expert.

Generate a clear, professional 1-page report.

User Input:
{input_text}

Analysis Result:
{analysis_result}

Report Format:

1. Summary
2. Risk Level
3. Key Findings
4. Explanation (simple terms)
5. Recommendations

Keep it concise but informative.
"""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a cybersecurity report generator."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.3
    )

    report_text = response.choices[0].message.content

    # ---------------- PDF GENERATION ---------------- #
    file_name = f"report_{uuid.uuid4().hex}.pdf"

    # FIX: Use tempfile.gettempdir() instead of relative "temp_reports/"
    # Relative paths break in Docker when WORKDIR differs or the FS layer is read-only.
    # tempfile.gettempdir() returns /tmp on Linux/Mac and %TEMP% on Windows — always writable.
    temp_dir = os.path.join(tempfile.gettempdir(), "scam_shield_reports")
    os.makedirs(temp_dir, exist_ok=True)
    file_path = os.path.join(temp_dir, file_name)

    doc = SimpleDocTemplate(file_path)
    styles = getSampleStyleSheet()

    content = []

    for line in report_text.split("\n"):
        content.append(Paragraph(line, styles["Normal"]))
        content.append(Spacer(1, 10))

    doc.build(content)

    return {
        "report_text": report_text,
        "pdf_path": file_path,
        "file_name": file_name
    }