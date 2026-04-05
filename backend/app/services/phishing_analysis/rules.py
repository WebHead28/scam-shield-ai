import re

URGENCY_PATTERNS = [
    r"urgent",
    r"immediately",
    r"action required",
    r"verify now",
    r"limited time"
]

THREAT_PATTERNS = [
    r"account suspended",
    r"legal action",
    r"blocked",
    r"penalty",
    r"unauthorized access"
]

def detect_patterns(text: str):
    text_lower = text.lower()

    urgency_hits = [p for p in URGENCY_PATTERNS if re.search(p, text_lower)]
    threat_hits = [p for p in THREAT_PATTERNS if re.search(p, text_lower)]

    return {
        "urgency_hits": urgency_hits,
        "threat_hits": threat_hits
    }