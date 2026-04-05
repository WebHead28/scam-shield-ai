import { useState } from 'react'

function getRiskColor(score) {
  if (score >= 0.7) return { bar: 'bg-red-500', text: 'text-red-400', glow: 'shadow-red-500/30' }
  if (score >= 0.4) return { bar: 'bg-amber-500', text: 'text-amber-400', glow: 'shadow-amber-500/30' }
  return { bar: 'bg-emerald-500', text: 'text-emerald-400', glow: 'shadow-emerald-500/30' }
}

function getConclusionStyle(conclusion) {
  const c = (conclusion || '').toLowerCase()
  if (c.includes('malicious') || c.includes('high risk') || c.includes('machine')) {
    return { badge: 'tag-danger', icon: '⚠', dot: 'bg-red-400' }
  }
  if (c.includes('suspicious') || c.includes('possibly') || c.includes('uncertain') || c.includes('mixed')) {
    return { badge: 'tag-warning', icon: '◈', dot: 'bg-amber-400' }
  }
  return { badge: 'tag-safe', icon: '✓', dot: 'bg-emerald-400' }
}

export default function ResultCard({ result, showRiskScore = false, onDownloadReport, inputText }) {
  const [expanded, setExpanded] = useState(false)
  const [downloading, setDownloading] = useState(false)

  if (!result) return null

  const { conclusion, confidence_level, evidence = [], risk_score, details } = result
  const style = getConclusionStyle(conclusion)
  const riskColors = risk_score !== undefined ? getRiskColor(risk_score) : null

  const handleDownload = async () => {
    if (!onDownloadReport) return
    setDownloading(true)
    try {
      await onDownloadReport(inputText, result)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="glass cyber-border rounded-xl p-6 animate-slide-up space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">Analysis Result</p>
          <div className="flex items-center gap-2.5">
            <span className={`dot-indicator ${style.dot} animate-pulse-slow`} />
            <h3 className="font-display font-bold text-xl text-slate-100">{conclusion}</h3>
          </div>
        </div>
        <span className={style.badge}>
          {style.icon} {confidence_level}
        </span>
      </div>

      {/* Risk Score */}
      {showRiskScore && risk_score !== undefined && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-mono text-slate-500">RISK SCORE</span>
            <span className={`font-mono font-bold text-lg ${riskColors.text}`}>
              {Math.round(risk_score * 100)}%
            </span>
          </div>
          <div className="risk-bar">
            <div
              className={`risk-fill ${riskColors.bar} shadow-lg ${riskColors.glow}`}
              style={{ width: `${risk_score * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Evidence */}
      {evidence.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">Evidence</p>
          <ul className="space-y-1.5">
            {evidence.map((e, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
                <span className="text-cyber-500 mt-0.5 font-mono">›</span>
                {e}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 pt-1">
        {details && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs font-mono text-slate-500 hover:text-cyber-400 transition-colors flex items-center gap-1.5"
          >
            <span>{expanded ? '▲' : '▼'}</span>
            {expanded ? 'Hide' : 'Show'} Details
          </button>
        )}
        {onDownloadReport && (
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="ml-auto cyber-btn-outline text-xs px-4 py-2 flex items-center gap-2"
          >
            {downloading ? (
              <>
                <span className="spinner w-3 h-3" />
                Generating...
              </>
            ) : (
              <>
                <DownloadIcon />
                Download PDF
              </>
            )}
          </button>
        )}
      </div>

      {/* Expanded Details */}
      {expanded && details && (
        <div className="border-t border-cyber-500/10 pt-4 animate-fade-in">
          <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-3">Raw Details</p>
          <div className="bg-navy-900/60 rounded-lg p-4 overflow-auto max-h-80">
            <pre className="text-xs font-mono text-slate-400 whitespace-pre-wrap leading-relaxed">
              {JSON.stringify(details, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}

function DownloadIcon() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  )
}
