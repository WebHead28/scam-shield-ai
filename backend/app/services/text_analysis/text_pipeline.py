from app.services.text_analysis.burstiness import analyze_burstiness
from app.services.text_analysis.stylometry import analyze_stylometry
from app.services.text_analysis.ngram_analysis import analyze_ngrams
from app.services.text_analysis.entropy import calculate_entropy
from app.services.text_analysis.llm_classifier import classify_with_llm
from app.services.text_analysis.perplexity import calculate_perplexity


def resolve_conflict(llm_data, results):
    label = llm_data.get("label", "").upper()

    entropy = results.get("entropy", 10)
    perplexity = results.get("perplexity", 100)
    repetition = results.get("repeated_trigrams", 0)

    ai_score = 0
    human_score = 0

    # --- AI signals ---
    if entropy < 4.0:
        ai_score += 2
    if perplexity < 40:
        ai_score += 2
    if repetition > 1:
        ai_score += 1

    # --- HUMAN signals ---
    if entropy > 4.5:
        human_score += 2
    if perplexity > 60:
        human_score += 2

    # --- conflict detection ---
    if label == "AI" and human_score >= 3:
        return "Uncertain", "Heuristics contradict AI classification"

    if label == "HUMAN" and ai_score >= 3:
        return "Possibly Machine-Generated", "Structured patterns detected"

    if label == "MIXED":
        return "Possibly Machine-Generated", "Hybrid content detected"

    return None, None


def analyze_text(text: str):

    results = {}
    word_count = len(text.split())

    if word_count < 12:
        return {
            "conclusion": "Uncertain",
            "confidence_level": "Low",
            "evidence": ["Text too short for reliable detection"],
            "details": {}
        }


    # --- STEP 1: LLM ANALYSIS (PRIMARY) ---
    llm_result = classify_with_llm(text)
    results["llm"] = llm_result

    # --- STEP 2: HEURISTICS (SECONDARY) ---
    results.update(calculate_perplexity(text))
    results.update(analyze_burstiness(text))
    results.update(analyze_stylometry(text))
    results.update(analyze_ngrams(text))
    results.update(calculate_entropy(text))

    evidence = []

    # --- LIGHT SUPPORT SIGNALS ONLY ---
    if results.get("entropy", 10) < 4:
        evidence.append("Low entropy")

    if results.get("repeated_trigrams", 0) > 1:
        evidence.append("Repetitive phrasing")

    # --- FINAL DECISION (LLM FIRST) ---
    llm_data = results.get("llm", {}).get("parsed", {})

    if not llm_data:
        return {
            "conclusion": "Uncertain",
            "confidence_level": "Low",
            "evidence": ["LLM response missing or invalid"],
            "details": results
        }


    if llm_data.get("label") == "UNKNOWN":

    
        # fallback to heuristics
        if results.get("entropy", 10) < 4 and results.get("perplexity", 100) < 40:
            return {
                "conclusion": "Possibly Machine-Generated",
                "confidence_level": "Medium",
                "evidence": ["Fallback heuristic triggered"],
                "details": results
            }

        return {
            "conclusion": "Uncertain",
            "confidence_level": "Low",
            "evidence": ["LLM unavailable"],
            "details": results
        }



    label = llm_data.get("label", "").upper()
    confidence_llm = llm_data.get("confidence", "LOW")

    override, reason = resolve_conflict(llm_data, results)

    if override:
        conclusion = override
        confidence = confidence_llm if confidence_llm != "LOW" else "Medium"
        evidence.append(reason)

    elif label == "AI":
        conclusion = "Likely Machine-Generated"
        confidence = confidence_llm

    elif label == "HUMAN":
        conclusion = "Likely Human-Written"
        confidence = confidence_llm

    elif label == "MIXED":
        conclusion = "Possibly Machine-Generated"
        confidence = "Medium"

    else:
        conclusion = "Uncertain"
        confidence = "Low"
    
    return {
        "conclusion": conclusion,
        "confidence_level": confidence,
        "evidence": evidence,
        "details": results
    }

