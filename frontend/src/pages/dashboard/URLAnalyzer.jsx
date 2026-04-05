import { useState } from 'react'
import toast from 'react-hot-toast'
import { analyzeURL, generateReport } from '../../services/api'
import Loader from '../../components/ui/Loader'

const EXAMPLES = [
  { label: 'Safe URL', url: 'https://www.google.com' },
  { label: 'Suspicious', url: 'http://secure-login-verify-account.xyz/update?token=abc123' },
  { label: 'IP-based', url: 'http://192.168.1.1/login/verify' },
]

function URLFlag({ label, active, activeLabel, inactiveLabel }) {
  return (
    <div className={`flex items-center justify-between px-3 py-2.5 rounded-lg border transition-all ${
      active
        ? 'bg-emerald-500/5 border-emerald-500/20'
        : 'bg-red-500/5 border-red-500/20'
    }`}>
      <span className="text-xs font-mono text-slate-400">{label}</span>
      <span className={`text-xs font-mono font-semibold ${active ? 'text-emerald-400' : 'text-red-400'}`}>
        {active ? (activeLabel || '✓ YES') : (inactiveLabel || '✗ NO')}
      </span>
    </div>
  )
}

function ScoreMeter({ score }) {
  const pct = Math.round((score || 0) * 100)
  const color = pct >= 70 ? '#ef4444' : pct >= 40 ? '#f59e0b' : '#10b981'
  const label = pct >= 70 ? 'MALICIOUS' : pct >= 40 ? 'SUSPICIOUS' : 'SAFE'

  return (
    <div className="glass cyber-border rounded-xl p-5 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">Threat Level</p>
        <span className="font-mono text-xs font-bold tracking-widest" style={{ color }}>{label}</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex-1 risk-bar h-3">
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}88, ${color})`, boxShadow: `0 0 10px ${color}50` }}
          />
        </div>
        <span className="font-display font-bold text-xl w-12 text-right" style={{ color }}>{pct}%</span>
      </div>
    </div>
  )
}

export default function URLAnalyzer() {
  const [url, setUrl] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleAnalyze = async () => {
    if (!url.trim()) {
      toast.error('Please enter a URL')
      return
    }
    const trimmed = url.trim()
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      toast.error('URL must start with http:// or https://')
      return
    }
    setLoading(true)
    setResult(null)
    try {
      const res = await analyzeURL(trimmed)
      setResult(res.data)
      toast.success('URL scan complete')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Scan failed. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAnalyze()
  }

  const handleDownloadReport = async () => {
    if (!result) return
    try {
      const res = await generateReport(url, result)
      const blob = new Blob([res.data], { type: 'application/pdf' })
      const urlObj = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = urlObj
      a.download = 'scam-shield-url-report.pdf'
      a.click()
      URL.revokeObjectURL(urlObj)
      toast.success('Report downloaded!')
    } catch {
      toast.error('Failed to generate report')
    }
  }

  const details = result?.details || {}

  return (
    <div className="space-y-6 page-enter">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <span className="text-2xl">🌐</span>
          <h1 className="font-display font-bold text-2xl text-slate-100">URL Scanner</h1>
        </div>
        <p className="text-sm text-slate-500 ml-10">
          Check any URL against Google Safe Browsing, VirusTotal, domain age, and heuristic analysis.
        </p>
      </div>

      {/* Input Card */}
      <div className="glass cyber-border rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-mono text-slate-600">Try an example:</span>
          {EXAMPLES.map((ex) => (
            <button
              key={ex.label}
              onClick={() => { setUrl(ex.url); setResult(null) }}
              className="tag tag-info hover:bg-cyber-500/20 transition-colors cursor-pointer"
            >
              {ex.label}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 text-sm font-mono">🔗</span>
            <input
              type="url"
              value={url}
              onChange={e => { setUrl(e.target.value); setResult(null) }}
              onKeyDown={handleKeyDown}
              className="input-cyber pl-8 font-mono text-sm"
              placeholder="https://example.com/path?query=value"
            />
          </div>
          <button
            onClick={handleAnalyze}
            disabled={loading || !url.trim()}
            className="cyber-btn-primary text-xs px-5 py-2.5 shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? <span className="spinner w-4 h-4" /> : 'Scan →'}
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && <Loader text="Scanning URL across threat databases..." />}

      {/* Results */}
      {result && !loading && (
        <div className="space-y-4 animate-slide-up">
          {/* Score meter */}
          <ScoreMeter score={result.risk_score} />

          {/* Conclusion card */}
          <div className="glass cyber-border rounded-xl p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-1">Verdict</p>
                <h3 className="font-display font-bold text-xl text-slate-100">{result.conclusion}</h3>
              </div>
              <span className={`tag ${
                result.conclusion?.toLowerCase().includes('malicious') ? 'tag-danger' :
                result.conclusion?.toLowerCase().includes('suspicious') ? 'tag-warning' : 'tag-safe'
              }`}>
                {result.confidence_level} confidence
              </span>
            </div>

            {/* URL Flags */}
            <div>
              <p className="text-xs font-mono text-slate-600 uppercase tracking-widest mb-2">Security Flags</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <URLFlag
                  label="HTTPS Secure"
                  active={details.has_https}
                  activeLabel="✓ SECURE"
                  inactiveLabel="✗ INSECURE"
                />
                <URLFlag
                  label="Domain Age"
                  active={!details.new_domain}
                  activeLabel="✓ ESTABLISHED"
                  inactiveLabel="✗ NEW DOMAIN"
                />
                <URLFlag
                  label="IP Address URL"
                  active={!details.uses_ip_address}
                  activeLabel="✓ DOMAIN"
                  inactiveLabel="✗ USES IP"
                />
                <URLFlag
                  label="Google Safe Browsing"
                  active={!details.google_flagged}
                  activeLabel="✓ CLEAN"
                  inactiveLabel="✗ FLAGGED"
                />
              </div>
            </div>

            {/* Heuristic reasons */}
            {details.heuristic_reasons?.length > 0 && (
              <div>
                <p className="text-xs font-mono text-slate-600 uppercase tracking-widest mb-2">Heuristic Flags</p>
                <div className="flex flex-wrap gap-1.5">
                  {details.heuristic_reasons.map((r, i) => (
                    <span key={i} className="tag-warning">{r}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Keyword hits */}
            {details.keyword_hits?.length > 0 && (
              <div>
                <p className="text-xs font-mono text-slate-600 uppercase tracking-widest mb-2">Suspicious Keywords</p>
                <div className="flex flex-wrap gap-1.5">
                  {details.keyword_hits.map((k, i) => (
                    <span key={i} className="tag-danger font-mono">{k}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Evidence */}
            {result.evidence?.length > 0 && (
              <div>
                <p className="text-xs font-mono text-slate-600 uppercase tracking-widest mb-2">Evidence</p>
                <ul className="space-y-1.5">
                  {result.evidence.map((e, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                      <span className="text-cyber-500 mt-0.5 font-mono">›</span> {e}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* VirusTotal stats */}
            {(details.vt_malicious !== undefined || details.vt_suspicious !== undefined) && (
              <div className="pt-2 border-t border-cyber-500/10">
                <p className="text-xs font-mono text-slate-600 uppercase tracking-widest mb-2">VirusTotal</p>
                <div className="flex gap-4">
                  <div className="text-center">
                    <div className={`font-display font-bold text-xl ${details.vt_malicious > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                      {details.vt_malicious ?? '—'}
                    </div>
                    <div className="text-[10px] font-mono text-slate-600">MALICIOUS</div>
                  </div>
                  <div className="text-center">
                    <div className={`font-display font-bold text-xl ${details.vt_suspicious > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {details.vt_suspicious ?? '—'}
                    </div>
                    <div className="text-[10px] font-mono text-slate-600">SUSPICIOUS</div>
                  </div>
                  {details.domain_age_days !== undefined && (
                    <div className="text-center">
                      <div className="font-display font-bold text-xl text-cyber-400">
                        {details.domain_age_days > 0 ? `${details.domain_age_days}d` : 'N/A'}
                      </div>
                      <div className="text-[10px] font-mono text-slate-600">DOMAIN AGE</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Download report */}
            <div className="pt-2">
              <button
                onClick={handleDownloadReport}
                className="cyber-btn-outline text-xs px-5 py-2 flex items-center gap-2"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download PDF Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info */}
      {!result && !loading && (
        <div className="glass rounded-xl p-5 border border-cyber-500/10">
          <p className="text-xs font-mono text-slate-600 uppercase tracking-widest mb-3">Scanning engines</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: '🛡️', label: 'Google Safe Browsing', desc: 'Real-time malware & phishing database' },
              { icon: '🦠', label: 'VirusTotal', desc: '70+ antivirus engines combined score' },
              { icon: '📅', label: 'Domain WHOIS', desc: 'Registration age and creation date' },
              { icon: '🔍', label: 'URL Heuristics', desc: 'Length, IP usage, special chars, keywords' },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-2.5">
                <span className="text-base">{item.icon}</span>
                <div>
                  <div className="text-xs font-display font-semibold text-slate-300 mb-0.5">{item.label}</div>
                  <div className="text-xs text-slate-600">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
