from app.services.phishing_analysis.rules import detect_patterns
from app.services.phishing_analysis.keywords import keyword_score
from app.services.phishing_analysis.ml_classifier import classify_message
from app.services.phishing_analysis.llm_analyzer import llm_analyze


def analyze_phishing(text: str):

    results = {}
    evidence = []

    # --- RULES ---
    rules = detect_patterns(text)
    results.update(rules)

    # --- KEYWORDS ---
    keywords = keyword_score(text)
    results.update(keywords)

    # --- BASIC ML ---
    ml = classify_message(text)
    results.update(ml)

    # --- LLM ANALYSIS (MAIN INTELLIGENCE) ---
    llm = llm_analyze(text)
    results.update(llm)

    # --- EVIDENCE BUILDING ---
    if rules["urgency_hits"]:
        evidence.append("Urgency language detected")

    if rules["threat_hits"]:
        evidence.append("Threat language detected")

    if keywords["keyword_score"] >= 4:
        evidence.append("High-risk keywords detected")

    if ml["contains_links"]:
        evidence.append("Contains suspicious links")

    if "phishing" in llm.get("llm_raw", "").lower():
        evidence.append("LLM flagged as phishing")

    # --- FINAL DECISION ENGINE ---
    score = 0

    # Rules
    score += len(rules["urgency_hits"]) * 0.1
    score += len(rules["threat_hits"]) * 0.15

    # Keywords
    score += min(keywords["keyword_score"] / 10, 0.3)

    # Links
    if ml["contains_links"]:
        score += 0.2

    # LLM (HEAVY WEIGHT)
    if "phishing" in llm.get("llm_raw", "").lower():
        score += 0.4

    # --- FINAL CLASSIFICATION ---
    if score > 0.75:
        conclusion = "High Risk Phishing Message"
        confidence = "High"
    elif score > 0.45:
        conclusion = "Possibly Phishing"
        confidence = "Medium"
    else:
        conclusion = "Likely Safe"
        confidence = "Low"

    return {
        "conclusion": conclusion,
        "confidence_level": confidence,
        "risk_score": round(score, 2),
        "evidence": evidence,
        "details": results
    }
