import numpy as np
from app.utils.text_utils import word_tokenize, get_word_frequencies

def calculate_entropy(text: str):
    words = word_tokenize(text)
    freq = get_word_frequencies(words)

    total = len(words)
    probs = [count / total for count in freq.values()]

    entropy = -sum(p * np.log2(p) for p in probs if p > 0)

    return {"entropy": float(entropy)}
