import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/layout/Navbar'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPw, setShowPw] = useState(false)
  const { register, loading } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password || !confirm) {
      toast.error('Please fill in all fields')
      return
    }
    if (password !== confirm) {
      toast.error('Passwords do not match')
      return
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    const result = await register(email, password)
    if (result.success) {
      toast.success('Account created! Please log in.')
      navigate('/login')
    } else {
      toast.error(result.error)
    }
  }

  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3
  const strengthLabel = ['', 'Weak', 'Medium', 'Strong'][strength]
  const strengthColor = ['', 'bg-red-500', 'bg-amber-500', 'bg-emerald-500'][strength]

  return (
    <div className="min-h-screen bg-cyber-gradient bg-grid noise flex flex-col">
      <Navbar minimal />

      <div className="flex-1 flex items-center justify-center px-4 pt-16">
        <div className="w-full max-w-md animate-slide-up">
          <div className="glass cyber-border rounded-2xl p-8 sm:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-cyber-500/10 border border-cyber-500/20 mb-4">
                <span className="text-2xl">🛡️</span>
              </div>
              <h1 className="font-display font-bold text-2xl text-slate-100 mb-1">Create account</h1>
              <p className="text-sm text-slate-500">Join Scam Shield AI today</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-500 uppercase tracking-widest">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="input-cyber"
                  placeholder="you@example.com"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-500 uppercase tracking-widest">Password</label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="input-cyber pr-10"
                    placeholder="Min. 6 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyber-400 transition-colors"
                  >
                    {showPw ? '🙈' : '👁'}
                  </button>
                </div>
                {password.length > 0 && (
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="flex gap-1 flex-1">
                      {[1, 2, 3].map((lvl) => (
                        <div key={lvl} className={`h-1 flex-1 rounded-full transition-all duration-300 ${strength >= lvl ? strengthColor : 'bg-navy-700'}`} />
                      ))}
                    </div>
                    <span className="text-xs font-mono text-slate-500">{strengthLabel}</span>
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-500 uppercase tracking-widest">Confirm Password</label>
                <input
                  type="password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  className="input-cyber"
                  placeholder="Repeat password"
                />
                {confirm && password !== confirm && (
                  <p className="text-xs text-red-400 font-mono mt-1">Passwords don't match</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full cyber-btn-primary justify-center mt-2 py-3"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="spinner" />
                    Creating account...
                  </span>
                ) : (
                  'Create Account →'
                )}
              </button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-cyber-400 hover:text-cyber-300 transition-colors font-medium">
                Sign in
              </Link>
            </p>
          </div>

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
