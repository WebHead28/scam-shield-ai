from collections import Counter
from app.utils.text_utils import word_tokenize

def get_ngrams(words, n):
    return zip(*[words[i:] for i in range(n)])

def analyze_ngrams(text: str):
    words = word_tokenize(text)

    trigrams = list(get_ngrams(words, 3))
    fourgrams = list(get_ngrams(words, 4))

    trigram_counts = Counter(trigrams)
    fourgram_counts = Counter(fourgrams)

    repeated = sum(1 for count in trigram_counts.values() if count > 1)

    return {
        "repeated_trigrams": repeated,
        "total_trigrams": len(trigrams)
    }
