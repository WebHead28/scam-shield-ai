import requests
import base64
from app.config.settings import VIRUSTOTAL_API_KEY

def check_virustotal(url: str):
    try:
        url_id = base64.urlsafe_b64encode(url.encode()).decode().strip("=")

        headers = {
            "x-apikey": VIRUSTOTAL_API_KEY
        }

        vt_url = f"https://www.virustotal.com/api/v3/urls/{url_id}"

        response = requests.get(vt_url, headers=headers, timeout=10)

        data = response.json()

        stats = data.get("data", {}).get("attributes", {}).get("last_analysis_stats", {})

        malicious = stats.get("malicious", 0)
        suspicious = stats.get("suspicious", 0)

        return {
            "vt_malicious": malicious,
            "vt_suspicious": suspicious
        }

    except:
        return {
            "vt_malicious": 0,
            "vt_suspicious": 0
        }
