import { useState } from 'react'
import toast from 'react-hot-toast'
import { analyzePhishing, generateReport } from '../../services/api'
import ResultCard from '../../components/ui/ResultCard'
import Loader from '../../components/ui/Loader'

const EXAMPLES = [
  {
    label: 'Phishing SMS',
    text: 'URGENT: Your bank account has been suspended due to unauthorized access. Verify your account immediately or face legal action. Click here: http://secure-bank-verify.xyz/login to restore access within 24 hours.',
  },
  {
    label: 'Safe Message',
    text: "Hey! Just checking in — are you still coming to dinner on Saturday? Let me know if the time works, we can always push it to 7pm instead. Looking forward to seeing you!",
  },
  {
    label: 'Suspicious Promo',
    text: 'Congratulations! You have been selected for a FREE bonus of $500. Click to verify your account and claim your reward now. Limited time offer — act immediately!',
  },
]

function RiskGauge({ score }) {
  const pct = Math.round((score || 0) * 100)
  const color = pct >= 70 ? '#ef4444' : pct >= 40 ? '#f59e0b' : '#10b981'
  const label = pct >= 70 ? 'HIGH RISK' : pct >= 40 ? 'MEDIUM' : 'LOW RISK'

  return (
    <div className="glass cyber-border rounded-xl p-6 space-y-4">
      <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">Risk Score</p>
      <div className="flex items-end gap-4">
        <div className="relative w-20 h-20">
          <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
            <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(6,182,212,0.08)" strokeWidth="8" />
            <circle
              cx="40" cy="40" r="32" fill="none"
              stroke={color}
              strokeWidth="8"
              strokeDasharray={`${2 * Math.PI * 32}`}
              strokeDashoffset={`${2 * Math.PI * 32 * (1 - pct / 100)}`}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 1s ease-out, stroke 0.5s ease' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display font-bold text-lg" style={{ color }}>{pct}%</span>
          </div>
        </div>
        <div>
          <div className="font-mono text-xs font-bold tracking-widest mb-1" style={{ color }}>{label}</div>
          <div className="text-xs text-slate-500">Phishing probability</div>
        </div>
      </div>
      {/* Bar */}
      <div className="risk-bar">
        <div
          className="risk-fill transition-all duration-1000 ease-out"
          style={{ width: `${pct}%`, background: color, boxShadow: `0 0 12px ${color}40` }}
        />
      </div>
    </div>
  )
}

export default function PhishingDetection() {
  const [text, setText] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleAnalyze = async () => {
    if (!text.trim()) {
      toast.error('Please enter a message to analyze')
      return
    }
    setLoading(true)
    setResult(null)
    try {
      const res = await analyzePhishing(text)
      setResult(res.data)
      toast.success('Phishing analysis complete')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Analysis failed. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadReport = async (inputText, analysisResult) => {
    try {
      const res = await generateReport(inputText, analysisResult)
      const blob = new Blob([res.data], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'scam-shield-phishing-report.pdf'
      a.click()
      URL.revokeObjectURL(url)
      toast.success('Report downloaded!')
    } catch {
      toast.error('Failed to generate report')
    }
  }

  return (
    <div className="space-y-6 page-enter">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <span className="text-2xl">🎣</span>
          <h1 className="font-display font-bold text-2xl text-slate-100">Phishing Detection</h1>
        </div>
        <p className="text-sm text-slate-500 ml-10">
          Analyze messages, emails, or SMS texts for phishing patterns, urgency manipulation, and malicious intent.
        </p>
      </div>

      {/* Input Card */}
      <div className="glass cyber-border rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-mono text-slate-600">Try an example:</span>
          {EXAMPLES.map((ex) => (
            <button
              key={ex.label}
              onClick={() => { setText(ex.text); setResult(null) }}
              className="tag tag-info hover:bg-cyber-500/20 transition-colors cursor-pointer"
            >
              {ex.label}
            </button>
          ))}
        </div>

        <textarea
          value={text}
          onChange={e => { setText(e.target.value); setResult(null) }}
          className="input-cyber w-full h-40 resize-none font-body text-sm leading-relaxed"
          placeholder="Paste an email, SMS, or any suspicious message here…"
        />

        <div className="flex items-center justify-between">
          <button
            onClick={() => { setText(''); setResult(null) }}
            className="text-xs font-mono text-slate-600 hover:text-slate-400 transition-colors"
            disabled={!text}
          >
            Clear
          </button>
          <button
            onClick={handleAnalyze}
            disabled={loading || !text.trim()}
            className="cyber-btn-primary text-xs px-6 py-2.5 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="spinner w-3.5 h-3.5" />
                Scanning...
              </span>
            ) : (
              'Scan Message →'
            )}
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && <Loader text="Scanning for phishing patterns..." />}

      {/* Results */}
      {result && !loading && (
        <div className="space-y-4 animate-slide-up">
          <RiskGauge score={result.risk_score} />
          <ResultCard
            result={result}
            showRiskScore={false}
            onDownloadReport={handleDownloadReport}
            inputText={text}
          />
        </div>
      )}

      {/* Info */}
      {!result && !loading && (
        <div className="glass rounded-xl p-5 border border-cyber-500/10">
          <p className="text-xs font-mono text-slate-600 uppercase tracking-widest mb-3">Detection signals</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: '⚡', label: 'Urgency Patterns', desc: 'Detects pressure phrases like "act now" or "immediately"' },
              { icon: '⚠️', label: 'Threat Language', desc: 'Flags account suspension, legal action warnings' },
              { icon: '🔑', label: 'Keyword Scoring', desc: 'Weighted scoring for high-risk words like "OTP", "password"' },
              { icon: '🤖', label: 'LLM Intent Analysis', desc: 'GPT-4o Mini analyzes attacker intent and strategy' },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-2.5">
                <span className="text-base mt-0.5">{item.icon}</span>
                <div>
                  <div className="text-xs font-display font-semibold text-slate-300 mb-0.5">{item.label}</div>
                  <div className="text-xs text-slate-600 leading-relaxed">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
