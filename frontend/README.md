# Scam Shield AI — Frontend

A modern React frontend for the Scam Shield AI backend, featuring AI text detection, phishing analysis, URL scanning, and PDF report generation.

## Tech Stack

- **React 18** + Vite
- **Tailwind CSS** (dark/light mode)
- **React Router v6**
- **Axios**
- **React Hot Toast**

## Design

- Dark-first cyberpunk aesthetic with cyan accents
- Glassmorphism cards with animated borders
- Responsive layout with fixed sidebar dashboard
- Smooth transitions and loading states
- Fully responsive (mobile + desktop)

## Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- The Scam Shield AI backend running at `http://localhost:8000`

### Install & Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── layout/
│   │   └── Navbar.jsx          # Top navigation bar
│   └── ui/
│       ├── ResultCard.jsx      # Shared analysis result display
│       └── Loader.jsx          # Animated loading spinner
├── context/
│   ├── AuthContext.jsx         # JWT auth state + login/register/logout
│   └── ThemeContext.jsx        # Dark/light mode with localStorage
├── pages/
│   ├── LandingPage.jsx         # Public landing page
│   ├── auth/
│   │   ├── LoginPage.jsx       # Login form
│   │   └── RegisterPage.jsx    # Register form with password strength
│   └── dashboard/
│       ├── Dashboard.jsx       # Layout with sidebar navigation
│       ├── TextAnalysis.jsx    # AI text detection page
│       ├── PhishingDetection.jsx  # Phishing scan page
│       ├── URLAnalyzer.jsx     # URL threat scanner page
│       └── ReportGenerator.jsx # PDF report generator page
├── services/
│   └── api.js                  # Axios instance + all API calls
├── App.jsx                     # Routes + providers
├── main.jsx                    # Entry point
└── index.css                   # Global styles + Tailwind
```

## Features

### Authentication
- Register / Login with JWT tokens
- Token stored in `localStorage`
- Protected routes — redirect to login if unauthenticated
- Auto-decode user email from JWT payload

### Dashboard Pages

**🧠 AI Text Detection**
- Multi-layer analysis: perplexity, burstiness, stylometry, n-grams, entropy, LLM
- Word count validation (min 12 words)
- Quick example texts (AI vs human)
- Expandable raw details section

**🎣 Phishing Detection**
- Circular risk gauge with animated progress
- Evidence bullet list
- Keyword and pattern detection display

**🌐 URL Scanner**
- Security flag grid (HTTPS, domain age, IP usage, Google Safe Browsing)
- VirusTotal malicious/suspicious counts
- Keyword hit badges
- Heuristic flag tags

**📄 Report Generator**
- Select analysis type (text / phishing / URL)
- Run analysis → preview result → download PDF
- Single workflow for all report types

### UX Details
- Toast notifications for all actions
- Loading spinners during API calls
- Example inputs on every analysis page
- Animated scan line on all pages
- Persistent dark/light theme via localStorage

## Environment

The frontend connects to `http://localhost:8000` by default.

To change the backend URL, edit:
```js
// src/services/api.js
const BASE_URL = 'http://localhost:8000'
```

## Backend Required

Make sure the Scam Shield AI backend is running:
```bash
cd backend
pip install -r requirements.txt
python run.py
```
