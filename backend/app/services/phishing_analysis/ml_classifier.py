import re

URL_PATTERN = r"(https?://[^\s]+|www\.[^\s]+)"

def classify_message(text: str):
    links = re.findall(URL_PATTERN, text)

    suspicious = False

    if links:
        suspicious = True

    return {
        "contains_links": bool(links),
        "links_found": links,
        "ml_label": "suspicious" if suspicious else "neutral"
    }
