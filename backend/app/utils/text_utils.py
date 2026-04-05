import re
from collections import Counter
import nltk
import os

# FIX: Use project-local nltk_data folder (portable)
NLTK_DATA_DIR = os.path.join(os.getcwd(), "nltk_data")

if not os.path.exists(NLTK_DATA_DIR):
    os.makedirs(NLTK_DATA_DIR)

nltk.data.path.append(NLTK_DATA_DIR)

# FIX: Download both `punkt` and `punkt_tab` — NLTK >= 3.8.1 requires `punkt_tab`
# for sent_tokenize(). Checking only `punkt` causes a LookupError at runtime on
# fresh CI runners and Docker images using the latest NLTK.
for resource, path in [("punkt", "tokenizers/punkt"), ("punkt_tab", "tokenizers/punkt_tab")]:
    try:
        nltk.data.find(path)
    except LookupError:
        try:
            nltk.download(resource, download_dir=NLTK_DATA_DIR, quiet=True)
        except Exception:
            pass  # Fail silently; sentence_tokenize will raise a clear error if missing


def clean_text(text: str) -> str:
    return text.strip()


def sentence_tokenize(text: str):
    return nltk.sent_tokenize(text)


def word_tokenize(text: str):
    return nltk.word_tokenize(text.lower())


def get_word_frequencies(words):
    return Counter(words)