from openai import OpenAI
from app.config.settings import OPENAI_API_KEY

client = OpenAI(api_key=OPENAI_API_KEY)


def llm_analyze(text: str):
    try:
        prompt = f"""
You are a cybersecurity phishing detection system.

Analyze the message below and classify it.

Return JSON with:
- label: phishing / suspicious / safe
- intent: what the attacker is trying to do
- risk_score: 0 to 1
- explanation: short reason

Message:
{text}
"""

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2,
        )

        output = response.choices[0].message.content

        return {
            "llm_raw": output
        }

    except Exception as e:
        return {
            "llm_raw": "LLM failed",
            "error": str(e)
        }
