FROM python:3.11-slim

WORKDIR /app

# System deps
RUN apt-get update \
    && apt-get install -y --no-install-recommends gcc \
    && rm -rf /var/lib/apt/lists/*

# Python deps — separate torch layer for better cache
COPY requirements.txt .
RUN pip install --no-cache-dir torch --index-url https://download.pytorch.org/whl/cpu
RUN pip install --no-cache-dir --timeout=120 --retries=5 -r requirements.txt

# Download NLTK data
RUN python -c "\
import nltk; \
nltk.download('punkt', quiet=True); \
nltk.download('punkt_tab', quiet=True)"

# --- NEW: Bake distilgpt2 into the image at build time ---
# This prevents runtime downloads, rate-limit hits, and cold-start latency
RUN python -c "\
from transformers import AutoModelForCausalLM, AutoTokenizer; \
AutoTokenizer.from_pretrained('distilgpt2', cache_dir='/app/models'); \
AutoModelForCausalLM.from_pretrained('distilgpt2', cache_dir='/app/models')"

COPY . .

# Reports dir — inside the container only, managed by named volume
RUN mkdir -p /tmp/scam_shield_reports

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]