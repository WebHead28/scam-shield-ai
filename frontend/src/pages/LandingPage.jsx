import { Link } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import { useAuth } from '../context/AuthContext'

const features = [
  {
    icon: '🧠',
    title: 'AI Text Detection',
    desc: 'Detect AI-generated content with multi-layer analysis including perplexity scoring, stylometry, and LLM classification.',
    tag: '/analyze-text',
  },
  {
    icon: '🎣',
    title: 'Phishing Detection',
    desc: 'Identify phishing attempts using rule-based pattern matching, keyword scoring, and LLM-powered intent analysis.',
    tag: '/analyze-phishing',
  },
  {
    icon: '🌐',
    title: 'URL Scanner',
    desc: 'Scan URLs against Google Safe Browsing, VirusTotal, and domain reputation checks in real-time.',
    tag: '/analyze-url',
  },
  {
    icon: '📄',
    title: 'PDF Reports',
    desc: 'Generate professional forensic-style PDF reports for any analysis — shareable, printable, court-ready.',
    tag: '/generate-report',
  },
]

const stats = [
  { value: '4', label: 'Detection Engines' },
  { value: '99%', label: 'Uptime SLA' },
  { value: '<2s', label: 'Avg Response' },
  { value: '∞', label: 'Scans/month' },
]

export default function LandingPage() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen bg-cyber-gradient bg-grid noise">
      <Navbar />

      {/* Hero */}
      <section className="pt-40 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background glow orbs */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-cyber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 right-1/4 w-64 h-64 bg-cyber-600/8 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyber-500/20 bg-cyber-500/5 mb-8">
            <span className="w-2 h-2 rounded-full bg-cyber-400 animate-pulse" />
            <span className="text-xs font-mono text-cyber-400 tracking-widest uppercase">AI-Powered Threat Detection</span>
          </div>

          <h1 className="font-display font-black text-5xl sm:text-7xl tracking-tight mb-6 leading-[1.05]">
            <span className="text-slate-100">Shield Against</span>
            <br />
            <span className="relative">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-300 via-cyber-400 to-cyber-600">
                Digital Threats
              </span>
              <span className="absolute -inset-1 bg-gradient-to-r from-cyber-500/10 to-transparent blur-lg pointer-events-none" />
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-body">
            Scam Shield AI combines machine learning, heuristic analysis, and LLM reasoning 
            to detect AI-generated content, phishing attacks, and malicious URLs — in seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {isAuthenticated ? (
              <Link to="/dashboard" className="cyber-btn-primary text-sm px-8 py-3.5">
                Open Dashboard →
              </Link>
            ) : (
              <>
                <Link to="/register" className="cyber-btn-primary text-sm px-8 py-3.5">
                  Start for free →
                </Link>
                <Link to="/login" className="cyber-btn-outline text-sm px-8 py-3.5">
                  Sign in
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-4 border-y border-cyber-500/10">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-display font-black text-3xl text-cyber-400 mb-1">{s.value}</div>
              <div className="text-xs font-mono text-slate-500 uppercase tracking-widest">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-mono text-cyber-500 uppercase tracking-widest mb-3">Capabilities</p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-100">
              Everything you need to stay safe
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {features.map((f) => (
              <div key={f.title} className="glass cyber-border rounded-xl p-6 group hover:border-cyber-500/30 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{f.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-display font-semibold text-slate-100">{f.title}</h3>
                      <span className="font-mono text-[10px] text-slate-600 hidden sm:block">{f.tag}</span>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 text-center border-t border-cyber-500/10">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display font-bold text-3xl text-slate-100 mb-4">
            Ready to detect threats?
          </h2>
          <p className="text-slate-400 mb-8">
            Join now and start scanning with AI-powered precision.
          </p>
          {!isAuthenticated && (
            <Link to="/register" className="cyber-btn-primary text-sm px-10 py-4">
              Create Free Account →
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-cyber-500/10 py-6 px-4 text-center">
        <p className="text-xs font-mono text-slate-600">
          © {new Date().getFullYear()} Scam Shield AI — Built with FastAPI + React
        </p>
      </footer>
    </div>
  )
}
