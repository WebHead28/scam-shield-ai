from app.services.url_analysis.google_safe import check_google_safe
from app.services.url_analysis.virustotal import check_virustotal
from app.services.url_analysis.domain_info import analyze_domain
from app.services.url_analysis.heuristics import basic_url_checks
from app.services.url_analysis.typo_detector import detect_typosquatting
from app.services.url_analysis.url_features import analyze_url_features


def analyze_url(url: str):

    results = {}
    evidence = []
    score = 0

    typo = detect_typosquatting(url)
    results.update(typo)

    if typo["typo_detected"]:
        score += 0.5
        evidence.append("Possible typosquatting detected")

    # --- URL FEATURES ---
    features = analyze_url_features(url)
    results.update(features)

    if not features["has_https"]:
        score += 0.1
        evidence.append("No HTTPS (insecure connection)")



    # --- Heuristics ---
    heuristics = basic_url_checks(url)
    results.update(heuristics)

    if heuristics["basic_suspicious"]:
        score += 0.2
        evidence.extend(heuristics["heuristic_reasons"])

    # --- Google Safe ---
    google = check_google_safe(url)
    results.update(google)

    if google["google_flagged"]:
        score += 0.5
        evidence.append("Flagged by Google Safe Browsing")

    # --- VirusTotal ---
    vt = check_virustotal(url)
    results.update(vt)

    if vt["vt_malicious"] > 0:
        score += 0.5
        evidence.append(f"{vt['vt_malicious']} engines flagged as malicious")

    elif vt["vt_suspicious"] > 0:
        score += 0.3
        evidence.append("Suspicious rating from VirusTotal")

    # --- Domain ---
    domain = analyze_domain(url)
    results.update(domain)

    if domain["new_domain"] is True:
        score += 0.2
        evidence.append("Newly registered domain")


    # --- FINAL ---
    if score >= 0.75:
        conclusion = "Malicious URL"
        confidence = "High"
    elif score > 0.4:
        conclusion = "Suspicious URL"
        confidence = "Medium"
    else:
        conclusion = "Safe URL"
        confidence = "Low"

    return {
        "conclusion": conclusion,
        "confidence_level": confidence,
        "risk_score": round(score, 2),
        "evidence": evidence,
        "details": results
    }
