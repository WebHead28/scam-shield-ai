import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/layout/Navbar'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const { login, loading } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Please fill in all fields')
      return
    }
    const result = await login(email, password)
    if (result.success) {
      toast.success('Welcome back!')
      navigate('/dashboard')
    } else {
      toast.error(result.error)
    }
  }

  return (
    <div className="min-h-screen bg-cyber-gradient bg-grid noise flex flex-col">
      <Navbar minimal />

      <div className="flex-1 flex items-center justify-center px-4 pt-16">
        <div className="w-full max-w-md animate-slide-up">
          {/* Card */}
          <div className="glass cyber-border rounded-2xl p-8 sm:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-cyber-500/10 border border-cyber-500/20 mb-4">
                <span className="text-2xl">🔐</span>
              </div>
              <h1 className="font-display font-bold text-2xl text-slate-100 mb-1">Welcome back</h1>
              <p className="text-sm text-slate-500">Sign in to your Scam Shield account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-500 uppercase tracking-widest">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="input-cyber"
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-500 uppercase tracking-widest">Password</label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="input-cyber pr-10"
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyber-400 transition-colors"
                  >
                    {showPw ? '🙈' : '👁'}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full cyber-btn-primary justify-center mt-2 py-3"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="spinner" />
                    Authenticating...
                  </span>
                ) : (
                  'Sign In →'
                )}
              </button>
            </form>

            {/* Footer */}
            <p className="text-center text-sm text-slate-500 mt-6">
              Don't have an account?{' '}
              <Link to="/register" className="text-cyber-400 hover:text-cyber-300 transition-colors font-medium">
                Register
              </Link>
            </p>
          </div>

          {/* Back */}
          <div className="text-center mt-4">
            <Link to="/" className="text-xs font-mono text-slate-600 hover:text-slate-400 transition-colors">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
