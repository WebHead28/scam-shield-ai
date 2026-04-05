import re

def basic_url_checks(url: str):
    suspicious = False
    reasons = []

    if len(url) > 75:
        suspicious = True
        reasons.append("URL too long")

    if "@" in url:
        suspicious = True
        reasons.append("Contains @ symbol")

    if re.search(r"\d+\.\d+\.\d+\.\d+", url):
        suspicious = True
        reasons.append("Uses IP address instead of domain")

    if url.count("-") > 3:
        suspicious = True
        reasons.append("Too many hyphens")

    return {
        "basic_suspicious": suspicious,
        "heuristic_reasons": reasons
    }
