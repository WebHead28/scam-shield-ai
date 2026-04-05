import numpy as np
from app.utils.text_utils import sentence_tokenize, word_tokenize

def analyze_burstiness(text: str):
    sentences = sentence_tokenize(text)
    sentence_lengths = [len(word_tokenize(s)) for s in sentences]

    if len(sentence_lengths) < 2:
       return {
            "mean_sentence_length": float(sentence_lengths[0]) if sentence_lengths else 0,
             "burstiness_score": -1  # special value → ignore later
        }


    mean_len = np.mean(sentence_lengths)
    std_dev = np.std(sentence_lengths)

    return {
        "mean_sentence_length": float(mean_len),
        "burstiness_score": float(std_dev)
    }
