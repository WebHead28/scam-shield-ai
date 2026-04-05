import difflib


POPULAR_DOMAINS = [
    "google.com",
    "amazon.com",
    "facebook.com",
    "paypal.com",
    "instagram.com",
    "netflix.com",
    "apple.com"
]

def normalize_domain(domain: str):
    # remove www.
    if domain.startswith("www."):
        domain = domain[4:]
    return domain

def detect_typosquatting(url: str):
    domain = url.split("//")[-1].split("/")[0]
    domain = normalize_domain(domain)

    matches = []

    for legit in POPULAR_DOMAINS:
        legit_clean = normalize_domain(legit)

        # ✅ EXACT MATCH → SAFE
        if domain == legit_clean:
            return {
                "typo_detected": False,
                "typo_matches": []
            }

        similarity = difflib.SequenceMatcher(None, domain, legit_clean).ratio()

        # ⚠️ stricter condition
        if 0.85 < similarity < 0.99:
            matches.append({
                "target": legit,
                "similarity": round(similarity, 2)
            })

    return {
        "typo_detected": len(matches) > 0,
        "typo_matches": matches
    }
