import { useState } from 'react'
import toast from 'react-hot-toast'
import { analyzeText, analyzePhishing, analyzeURL, generateReport } from '../../services/api'
import Loader from '../../components/ui/Loader'

const REPORT_TYPES = [
  {
    id: 'text',
    icon: '🧠',
    label: 'AI Text Detection',
    desc: 'Generate report for AI-generated content analysis',
    placeholder: 'Paste the text you want to analyze and report…',
    inputLabel: 'Text to analyze',
  },
  {
    id: 'phishing',
    icon: '🎣',
    label: 'Phishing Analysis',
    desc: 'Generate report for phishing message analysis',
    placeholder: 'Paste the suspicious message or email…',
    inputLabel: 'Message to analyze',
  },
  {
    id: 'url',
    icon: '🌐',
    label: 'URL Scan',
    desc: 'Generate report for URL threat analysis',
    placeholder: 'https://example.com',
    inputLabel: 'URL to analyze',
  },
]

export default function ReportGenerator() {
  const [selectedType, setSelectedType] = useState('text')
  const [input, setInput] = useState('')
  const [analysisResult, setAnalysisResult] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [step, setStep] = useState('input') // input | analyzed

  const currentType = REPORT_TYPES.find(t => t.id === selectedType)

  const handleAnalyze = async () => {
    if (!input.trim()) {
      toast.error('Please enter some input first')
      return
    }
    if (selectedType === 'url') {
      if (!input.startsWith('http://') && !input.startsWith('https://')) {
        toast.error('URL must start with http:// or https://')
        return
      }
    }

    setAnalyzing(true)
    setAnalysisResult(null)

    try {
      let res
      if (selectedType === 'text') res = await analyzeText(input)
      else if (selectedType === 'phishing') res = await analyzePhishing(input)
      else if (selectedType === 'url') res = await analyzeURL(input)

      setAnalysisResult(res.data)
      setStep('analyzed')
      toast.success('Analysis complete — ready to generate report')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Analysis failed')
    } finally {
      setAnalyzing(false)
    }
  }

  const handleDownload = async () => {
    if (!analysisResult) {
      toast.error('Run an analysis first')
      return
    }
    setDownloading(true)
    try {
      const res = await generateReport(input, analysisResult, selectedType)
      const blob = new Blob([res.data], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `scam-shield-${selectedType}-report.pdf`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('Report downloaded!')
    } catch {
      toast.error('Failed to generate PDF report')
    } finally {
      setDownloading(false)
    }
  }

  const handleReset = () => {
    setInput('')
    setAnalysisResult(null)
    setStep('input')
  }

  const getResultStyle = (conclusion) => {
    const c = (conclusion || '').toLowerCase()
    if (c.includes('malicious') || c.includes('high risk') || c.includes('machine')) return 'text-red-400'
    if (c.includes('suspicious') || c.includes('possibly') || c.includes('uncertain')) return 'text-amber-400'
    return 'text-emerald-400'
  }

  return (
    <div className="space-y-6 page-enter">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <span className="text-2xl">📄</span>
          <h1 className="font-display font-bold text-2xl text-slate-100">Report Generator</h1>
        </div>
        <p className="text-sm text-slate-500 ml-10">
          Run an analysis and generate a professional PDF forensic report you can save or share.
        </p>
      </div>

      {/* Type selector */}
      <div className="glass cyber-border rounded-xl p-6 space-y-4">
        <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">Select Analysis Type</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {REPORT_TYPES.map((type) => (
            <button
              key={type.id}
              onClick={() => { setSelectedType(type.id); handleReset() }}
              className={`flex items-start gap-3 p-3.5 rounded-lg border text-left transition-all duration-200 ${
                selectedType === type.id
                  ? 'bg-cyber-500/10 border-cyber-500/30 text-cyber-400'
                  : 'border-cyber-500/10 text-slate-400 hover:border-cyber-500/20 hover:text-slate-300'
              }`}
            >
              <span className="text-xl mt-0.5">{type.icon}</span>
              <div>
                <div className="text-sm font-display font-medium leading-none mb-1">{type.label}</div>
                <div className="text-[11px] text-slate-600 leading-relaxed">{type.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="glass cyber-border rounded-xl p-6 space-y-4">
        <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">{currentType.inputLabel}</p>

        {selectedType === 'url' ? (
          <input
            type="url"
            value={input}
            onChange={e => { setInput(e.target.value); setStep('input'); setAnalysisResult(null) }}
            className="input-cyber font-mono text-sm"
            placeholder={currentType.placeholder}
            disabled={step === 'analyzed'}
          />
        ) : (
          <textarea
            value={input}
            onChange={e => { setInput(e.target.value); setStep('input'); setAnalysisResult(null) }}
            className="input-cyber w-full h-36 resize-none font-body text-sm leading-relaxed"
            placeholder={currentType.placeholder}
            disabled={step === 'analyzed'}
          />
        )}

        {step === 'input' ? (
          <button
            onClick={handleAnalyze}
            disabled={analyzing || !input.trim()}
            className="cyber-btn-primary text-xs px-6 py-2.5 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {analyzing ? (
              <span className="flex items-center gap-2">
                <span className="spinner w-3.5 h-3.5" />
                Analyzing...
              </span>
            ) : (
              `Analyze with ${currentType.icon} →`
            )}
          </button>
        ) : (
          <button
            onClick={handleReset}
            className="text-xs font-mono text-slate-500 hover:text-slate-300 transition-colors"
          >
            ← Change input
          </button>
        )}
      </div>

      {/* Loader */}
      {analyzing && <Loader text="Running analysis pipeline..." />}

      {/* Analysis Preview + Download */}
      {analysisResult && step === 'analyzed' && !analyzing && (
        <div className="space-y-4 animate-slide-up">
          {/* Preview */}
          <div className="glass cyber-border rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-cyber-400 animate-pulse" />
              <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">Analysis Preview</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <p className="text-[10px] font-mono text-slate-600 uppercase tracking-wider">Conclusion</p>
                <p className={`font-display font-bold text-base ${getResultStyle(analysisResult.conclusion)}`}>
                  {analysisResult.conclusion}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-mono text-slate-600 uppercase tracking-wider">Confidence</p>
                <p className="font-display font-bold text-base text-slate-200">{analysisResult.confidence_level}</p>
              </div>
              {analysisResult.risk_score !== undefined && (
                <div className="space-y-1">
                  <p className="text-[10px] font-mono text-slate-600 uppercase tracking-wider">Risk Score</p>
                  <p className="font-display font-bold text-base text-cyber-400">
                    {Math.round(analysisResult.risk_score * 100)}%
                  </p>
                </div>
              )}
            </div>

            {analysisResult.evidence?.length > 0 && (
              <div>
                <p className="text-[10px] font-mono text-slate-600 uppercase tracking-wider mb-2">Key Evidence</p>
                <ul className="space-y-1">
                  {analysisResult.evidence.slice(0, 4).map((e, i) => (
                    <li key={i} className="text-xs text-slate-400 flex items-start gap-1.5">
                      <span className="text-cyber-500 mt-0.5">›</span> {e}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Download button */}
          <div className="glass cyber-border rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-semibold text-slate-100 mb-1">Ready to export</h3>
                <p className="text-xs text-slate-500">
                  Your analysis report is ready. Download as a professional PDF document.
                </p>
              </div>
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="cyber-btn-primary text-xs px-6 py-3 shrink-0"
              >
                {downloading ? (
                  <span className="flex items-center gap-2">
                    <span className="spinner w-3.5 h-3.5" />
                    Generating PDF...
                  </span>
                ) : (
                  <>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download PDF Report
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* How it works */}
      {step === 'input' && !analyzing && (
        <div className="glass rounded-xl p-5 border border-cyber-500/10">
          <p className="text-xs font-mono text-slate-600 uppercase tracking-widest mb-3">How to generate a report</p>
          <ol className="space-y-3">
            {[
              'Select the type of analysis you need above',
              'Enter your text, message, or URL in the input field',
              'Click Analyze to run the detection pipeline',
              'Review the analysis preview, then download your PDF report',
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-xs text-slate-500">
                <span className="font-mono text-cyber-600 font-bold w-4 shrink-0">{i + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  )
}
