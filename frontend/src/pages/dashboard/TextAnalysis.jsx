import { useState } from 'react'
import toast from 'react-hot-toast'
import { analyzeText, generateReport } from '../../services/api'
import ResultCard from '../../components/ui/ResultCard'
import Loader from '../../components/ui/Loader'

const EXAMPLE_TEXTS = [
  {
    label: 'AI Sample',
    text: 'Artificial intelligence has revolutionized numerous industries by enabling machines to perform tasks that previously required human intelligence. Through advanced algorithms and machine learning techniques, AI systems can now process vast amounts of data, recognize patterns, and make informed decisions with remarkable accuracy.',
  },
  {
    label: 'Human Sample',
    text: "honestly I've been thinking about this for a while now and I don't think the whole AI thing is as scary as people make it out to be?? like yeah it can write essays or whatever but it doesn't actually *get* what it's saying lol",
  },
]

export default function TextAnalysis() {
  const [text, setText] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleAnalyze = async () => {
    if (!text.trim()) {
      toast.error('Please enter some text to analyze')
      return
    }
    if (text.trim().split(/\s+/).length < 12) {
      toast.error('Text must be at least 12 words for reliable analysis')
      return
    }
    setLoading(true)
    setResult(null)
    try {
      const res = await analyzeText(text)
      setResult(res.data)
      toast.success('Analysis complete')
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
      a.download = 'scam-shield-text-report.pdf'
      a.click()
      URL.revokeObjectURL(url)
      toast.success('Report downloaded!')
    } catch {
      toast.error('Failed to generate report')
    }
  }

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0

  return (
    <div className="space-y-6 page-enter">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <span className="text-2xl">🧠</span>
          <h1 className="font-display font-bold text-2xl text-slate-100">AI Text Detection</h1>
        </div>
        <p className="text-sm text-slate-500 ml-10">
          Detect whether text is AI-generated or human-written using perplexity, stylometry, and LLM analysis.
        </p>
      </div>

      {/* Input Card */}
      <div className="glass cyber-border rounded-xl p-6 space-y-4">
        {/* Quick examples */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-mono text-slate-600">Quick load:</span>
          {EXAMPLE_TEXTS.map((ex) => (
            <button
              key={ex.label}
              onClick={() => { setText(ex.text); setResult(null) }}
              className="tag tag-info hover:bg-cyber-500/20 transition-colors cursor-pointer"
            >
              {ex.label}
            </button>
          ))}
        </div>

        {/* Textarea */}
        <div className="relative">
          <textarea
            value={text}
            onChange={e => { setText(e.target.value); setResult(null) }}
            className="input-cyber w-full h-44 resize-none font-body text-sm leading-relaxed"
            placeholder="Paste any text here to detect if it's AI-generated or human-written…"
          />
          <div className="absolute bottom-3 right-3 text-xs font-mono text-slate-600">
            {wordCount} words
          </div>
        </div>

        {/* Actions */}
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
                Analyzing...
              </span>
            ) : (
              'Analyze Text →'
            )}
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && <Loader text="Running AI detection pipeline..." />}

      {/* Result */}
      {result && !loading && (
        <ResultCard
          result={result}
          showRiskScore={false}
          onDownloadReport={handleDownloadReport}
          inputText={text}
        />
      )}

      {/* Info box */}
      {!result && !loading && (
        <div className="glass rounded-xl p-5 border border-cyber-500/10">
          <p className="text-xs font-mono text-slate-600 uppercase tracking-widest mb-3">How it works</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { step: '01', label: 'Perplexity', desc: 'Measures language predictability using DistilGPT-2' },
              { step: '02', label: 'Stylometry', desc: 'Analyzes function word ratios and punctuation patterns' },
              { step: '03', label: 'LLM Verdict', desc: 'GPT-4.1 Mini makes the final classification decision' },
            ].map((item) => (
              <div key={item.step} className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-cyber-600">{item.step}</span>
                  <span className="text-xs font-display font-semibold text-slate-300">{item.label}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
