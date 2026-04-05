import re

SUSPICIOUS_KEYWORDS = [
    "login", "verify", "secure", "account",
    "update", "bank", "free", "bonus", "urgent"
]

def analyze_url_features(url: str):

    url_lower = url.lower()

    keyword_hits = [kw for kw in SUSPICIOUS_KEYWORDS if kw in url_lower]

    has_https = url.lower().startswith("https://")

    # Check for IP-based URL (VERY suspicious)
    ip_pattern = r"(http[s]?://)?(\d{1,3}\.){3}\d{1,3}"
    uses_ip = bool(re.search(ip_pattern, url))

    return {
        "has_https": has_https,
        "keyword_hits": keyword_hits,
        "uses_ip_address": uses_ip
    }
