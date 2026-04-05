import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'

function ShieldIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="5" />
      <path strokeLinecap="round" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  )
}

export default function Navbar({ minimal = false }) {
  const { isAuthenticated, user, logout } = useAuth()
  const { isDark, toggle } = useTheme()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-cyber-500/10 backdrop-blur-lg bg-navy-900/80 dark:bg-navy-900/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <div className="absolute inset-0 bg-cyber-500/20 rounded-lg blur-sm group-hover:bg-cyber-500/30 transition-all" />
              <ShieldIcon className="relative w-7 h-7 text-cyber-400" />
            </div>
            <span className="font-display font-bold text-lg tracking-tight">
              <span className="text-cyber-400">Scam</span>
              <span className="text-slate-100 dark:text-slate-100 light:text-slate-800"> Shield</span>
              <span className="text-cyber-500 text-xs ml-1 font-mono align-top mt-1 inline-block">AI</span>
            </span>
          </Link>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <button
              onClick={toggle}
              className="flex items-center justify-center w-8 h-8 rounded-lg border border-cyber-500/20 text-slate-400 hover:text-cyber-400 hover:border-cyber-500/40 transition-all"
              title="Toggle theme"
            >
              {isDark ? <SunIcon /> : <MoonIcon />}
            </button>

            {!minimal && (
              <>
                {isAuthenticated ? (
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-slate-500 hidden sm:block">
                      {user?.email}
                    </span>
                    <Link
                      to="/dashboard"
                      className="text-sm font-display font-medium text-cyber-400 hover:text-cyber-300 transition-colors"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="text-sm font-display font-medium text-slate-400 hover:text-red-400 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link
                      to="/login"
                      className="text-sm font-display font-medium text-slate-400 hover:text-slate-200 transition-colors px-3 py-1.5"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="cyber-btn-primary text-xs px-4 py-2"
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
