def evaluate_reputation(results):

    evidence = []

    # 🚨 Domain age
    age = results.get("domain_age_days")

    if age is not None and age < 30:
        evidence.append("Recently registered domain")

    # 🚨 HTTPS
    if not results.get("has_https"):
        evidence.append("No HTTPS (insecure connection)")

    # 🚨 Keywords
    if len(results.get("keyword_hits", [])) >= 2:
        evidence.append("Suspicious keywords in URL")

    # 🚨 IP usage
    if results.get("uses_ip_address"):
        evidence.append("Uses IP address instead of domain")

    return evidence
