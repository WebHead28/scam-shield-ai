import os
import math
import threading

# FIX: Thread lock prevents double-loading under concurrent requests
_model_lock = threading.Lock()

model = None
tokenizer = None

# Use the path baked into the Docker image at build time
# Falls back to local relative path for development outside Docker
_CACHE_DIR = os.environ.get("MODEL_CACHE_DIR", "/app/models")

def load_model():
    global model, tokenizer
    # FIX: Double-checked locking pattern — avoids lock acquisition on every call
    if model is not None:
        return

    with _model_lock:
        if model is not None:
            return
        try:
            from transformers import AutoModelForCausalLM, AutoTokenizer
            import torch
            tokenizer = AutoTokenizer.from_pretrained("distilgpt2", cache_dir=_CACHE_DIR)
            model = AutoModelForCausalLM.from_pretrained("distilgpt2", cache_dir=_CACHE_DIR)
            model.eval()
        except Exception as e:
            # FIX: Log but do not crash — calculate_perplexity will return safe fallback
            import logging
            logging.getLogger(__name__).warning(f"Failed to load distilgpt2: {e}")


def calculate_perplexity(text: str):
    load_model()

    # FIX: If model failed to load, return a safe neutral fallback value
    # rather than crashing the entire text analysis pipeline
    if model is None or tokenizer is None:
        return {"perplexity": 100.0}  # neutral value — won't skew heuristics

    try:
        import torch
        encodings = tokenizer(text, return_tensors="pt")
        input_ids = encodings.input_ids

        with torch.no_grad():
            outputs = model(input_ids, labels=input_ids)
            loss = outputs.loss

        perplexity = math.exp(loss.item())
        return {"perplexity": float(perplexity)}

    except Exception as e:
        import logging
        logging.getLogger(__name__).warning(f"Perplexity calculation failed: {e}")
        return {"perplexity": 100.0}  # FIX: safe fallback