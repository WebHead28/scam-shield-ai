import { Routes, Route, NavLink, useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import TextAnalysis from './TextAnalysis'
import PhishingDetection from './PhishingDetection'
import URLAnalyzer from './URLAnalyzer'
import ReportGenerator from './ReportGenerator'

const navItems = [
  { path: 'text', label: 'AI Detection', icon: '🧠', desc: 'Analyze text origin' },
  { path: 'phishing', label: 'Phishing', icon: '🎣', desc: 'Scan messages' },
  { path: 'url', label: 'URL Scanner', icon: '🌐', desc: 'Check links' },
  { path: 'report', label: 'Reports', icon: '📄', desc: 'Generate PDF' },
]

function SunIcon() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="5" />
      <path strokeLinecap="round" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  )
}
function MoonIcon() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  )
}

export default function Dashboard() {
  const { user, logout } = useAuth()
  const { isDark, toggle } = useTheme()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen flex bg-navy-900 dark:bg-navy-900">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 glass border-r border-cyber-500/10 flex flex-col fixed top-0 bottom-0 left-0 z-40">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-cyber-500/10">
          <NavLink to="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <div className="absolute inset-0 bg-cyber-500/20 rounded-lg blur-sm" />
              <svg className="relative w-6 h-6 text-cyber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <div>
              <div className="font-display font-bold text-base leading-none">
                <span className="text-cyber-400">Scam</span>
                <span className="text-slate-100"> Shield</span>
              </div>
              <div className="text-[10px] font-mono text-slate-600 mt-0.5">AI Detection Suite</div>
            </div>
          </NavLink>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest px-2 mb-3">Tools</p>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? 'bg-cyber-500/10 border border-cyber-500/20 text-cyber-400'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              <div>
                <div className="text-sm font-display font-medium leading-none mb-0.5">{item.label}</div>
                <div className="text-[10px] font-mono text-slate-600">{item.desc}</div>
              </div>
            </NavLink>
          ))}
        </nav>

        {/* Bottom user section */}
        <div className="px-3 py-4 border-t border-cyber-500/10 space-y-2">
          {/* Theme toggle */}
          <button
            onClick={toggle}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all text-xs font-mono"
          >
            <span>{isDark ? 'Dark Mode' : 'Light Mode'}</span>
            {isDark ? <SunIcon /> : <MoonIcon />}
          </button>

          {/* User */}
          <div className="px-3 py-2 rounded-lg bg-cyber-500/5 border border-cyber-500/10">
            <p className="text-[10px] font-mono text-slate-600 mb-0.5">Signed in as</p>
            <p className="text-xs font-mono text-cyber-400 truncate">{user?.email}</p>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/5 transition-all text-xs font-mono"
          >
            <span>→</span> Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-64 min-h-screen bg-grid">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <Routes>
            <Route index element={<Navigate to="text" replace />} />
            <Route path="text" element={<TextAnalysis />} />
            <Route path="phishing" element={<PhishingDetection />} />
            <Route path="url" element={<URLAnalyzer />} />
            <Route path="report" element={<ReportGenerator />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}
