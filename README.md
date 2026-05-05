# 🛡️ Scam Shield AI

A FastAPI-based cybersecurity platform that uses AI and heuristics to detect phishing messages, malicious URLs, AI-generated text, and generate professional security reports.

---

## 🚀 Features

- **URL Analysis** — Detects malicious URLs using Google Safe Browsing, VirusTotal, WHOIS domain age, typosquatting detection, and heuristics
- **Text AI Detection** — Classifies text as Human, AI-Generated, or Mixed using GPT-4 + perplexity, entropy, burstiness, and n-gram heuristics
- **Phishing Message Detection** — Analyses messages for phishing intent using LLM classification, keyword scoring, and pattern rules
- **PDF Report Generation** — Generates professional cybersecurity reports via OpenAI and ReportLab
- **User Authentication** — JWT-based registration and login system with bcrypt password hashing

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | FastAPI, Python 3.11 |
| AI/LLM | OpenAI GPT-4, DistilGPT2 (Transformers) |
| NLP | NLTK, NumPy |
| Database | SQLite + SQLAlchemy |
| Auth | JWT (python-jose), Passlib/bcrypt |
| External APIs | OpenAI, Google Safe Browsing, VirusTotal |
| PDF | ReportLab |
| Deployment | Docker, GitHub Actions CI/CD |

---

## 📁 Project Structure

```
backend/
├── app/
│   ├── api/
│   │   └── routes/
│   │       ├── auth_routes.py
│   │       ├── text_routes.py
│   │       ├── phishing_routes.py
│   │       ├── url_routes.py
│   │       └── report_routes.py
│   ├── services/
│   │   ├── text_analysis/
│   │   │   ├── text_pipeline.py
│   │   │   ├── llm_classifier.py
│   │   │   ├── perplexity.py
│   │   │   ├── burstiness.py
│   │   │   ├── entropy.py
│   │   │   ├── stylometry.py
│   │   │   └── ngram_analysis.py
│   │   ├── phishing_analysis/
│   │   │   ├── phishing_pipeline.py
│   │   │   ├── llm_analyzer.py
│   │   │   ├── keywords.py
│   │   │   ├── ml_classifier.py
│   │   │   └── rules.py
│   │   ├── url_analysis/
│   │   │   ├── url_pipeline.py
│   │   │   ├── google_safe.py
│   │   │   ├── virustotal.py
│   │   │   ├── domain_info.py
│   │   │   ├── typo_detector.py
│   │   │   ├── heuristics.py
│   │   │   └── url_features.py
│   │   └── report_generation/
│   │       └── report_pipeline.py
│   ├── models/
│   │   └── user.py
│   ├── db/
│   │   ├── database.py
│   │   └── deps.py
│   ├── utils/
│   │   ├── auth.py
│   │   └── text_utils.py
│   ├── config/
│   │   └── settings.py
│   └── main.py
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
└── run.py
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Python 3.11+
- Docker (optional)
- OpenAI API key
- Google Safe Browsing API key
- VirusTotal API key

### Local Setup

**1. Clone the repository**
```bash
git clone https://github.com/junaydinhub/scam-shield-ai.git
cd scam-shield-ai/backend
```

**2. Create virtual environment**
```bash
python -m venv venv
source venv/bin/activate
```

**3. Install dependencies**
```bash
pip install torch --index-url https://download.pytorch.org/whl/cpu
pip install -r requirements.txt
```

**4. Create `.env` file**
```bash
cp .env.example .env
# Then fill in your API keys
```

**5. Run the server**
```bash
python run.py
```

The API will be live at `http://localhost:8000`

---

## 🐳 Docker Setup

```bash
cd backend
docker compose up --build
```

The API will be live at `http://localhost:8000`

---

## 🔑 Environment Variables

Create a `.env` file in the `backend/` directory:

```env
OPENAI_API_KEY=your_openai_key_here
GOOGLE_API_KEY=your_google_safe_browsing_key_here
VIRUSTOTAL_API_KEY=your_virustotal_key_here
SECRET_KEY=your_long_random_secret_key_here
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Register a new user |
| POST | `/login` | Login and get JWT token |
| POST | `/analyze-text` | Detect AI-generated text |
| POST | `/analyze-phishing` | Detect phishing messages |
| POST | `/analyze-url` | Analyse URL for threats |
| POST | `/generate-report` | Generate PDF security report |
| GET | `/` | Health check |

---

## 🔍 How It Works

### Text AI Detection
1. Text is sent to GPT-4 for primary classification (AI / Human / Mixed)
2. Heuristics run in parallel: perplexity (DistilGPT2), entropy, burstiness, n-gram repetition, stylometry
3. A conflict resolver compares LLM vs heuristic results
4. Final verdict is returned with confidence level and evidence

### URL Analysis
1. Typosquatting check against popular domains
2. HTTPS and keyword feature extraction
3. Heuristic checks (URL length, @ symbols, IP addresses)
4. Google Safe Browsing API lookup
5. VirusTotal API scan
6. WHOIS domain age check
7. Weighted scoring produces final risk verdict

### Phishing Detection
1. Rule-based urgency and threat pattern matching
2. Suspicious keyword scoring
3. Link detection
4. GPT-4o-mini LLM analysis
5. Weighted scoring produces final risk verdict

---

## 🔄 CI/CD Pipeline

GitHub Actions workflow runs on every push to `main`:

1. ✅ Install Python dependencies
2. ✅ Download NLTK data
3. ✅ Verify app imports successfully
4. ✅ Build Docker image

---

## 🧪 Running Tests

```bash
cd backend
python -c "from app.main import app; print('App loaded successfully')"
```

---

## 📄 License

This project is for educational and portfolio purposes.

---

## 👤 Author

**Junaydin Hub**  
GitHub: [@junaydinhub](https://github.com/junaydinhub)
