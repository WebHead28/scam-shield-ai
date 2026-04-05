import requests
from app.config.settings import GOOGLE_API_KEY

def check_google_safe(url: str):
    endpoint = f"https://safebrowsing.googleapis.com/v4/threatMatches:find?key={GOOGLE_API_KEY}"

    payload = {
        "client": {
            "clientId": "scam-shield",
            "clientVersion": "1.0"
        },
        "threatInfo": {
            "threatTypes": ["MALWARE", "SOCIAL_ENGINEERING"],
            "platformTypes": ["ANY_PLATFORM"],
            "threatEntryTypes": ["URL"],
            "threatEntries": [{"url": url}]
        }
    }

    try:
        res = requests.post(endpoint, json=payload, timeout=10)

        if res.status_code == 200 and res.json():
            return {"google_flagged": True}
        
        return {"google_flagged": False}

    except:
        return {"google_flagged": False}
