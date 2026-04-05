from app.utils.text_utils import word_tokenize

FUNCTION_WORDS = {
    "the", "is", "at", "which", "on", "and", "a",
    "to", "in", "that", "it", "of", "for", "with",
    "as", "was", "were", "be", "by", "this", "are"
}


def analyze_stylometry(text: str):
    words = word_tokenize(text)

    function_word_count = sum(1 for w in words if w in FUNCTION_WORDS)

    punctuation_count = sum(1 for c in text if c in ".,!?;:")

    return {
        "function_word_ratio": function_word_count / len(words) if words else 0,
        "punctuation_count": punctuation_count
    }
