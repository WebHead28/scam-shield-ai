SUSPICIOUS_KEYWORDS = {
    "bank": 2,
    "password": 3,
    "otp": 3,
    "verify": 2,
    "click": 2,
    "login": 2,
    "account": 2,
    "update": 1,
    "security": 1
}

def keyword_score(text: str):
    words = text.lower().split()

    score = 0
    hits = []

    for word in words:
        if word in SUSPICIOUS_KEYWORDS:
            score += SUSPICIOUS_KEYWORDS[word]
            hits.append(word)

    return {
        "keyword_score": score,
        "keyword_hits": hits
    }
