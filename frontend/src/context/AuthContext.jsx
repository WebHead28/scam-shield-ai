import { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('ss_token'))
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (token) {
      // Decode email from token payload (simple base64 decode)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        setUser({ email: payload.sub })
      } catch {
        setUser({ email: 'User' })
      }
    } else {
      setUser(null)
    }
  }, [token])

  const login = async (email, password) => {
    setLoading(true)
    try {
      const res = await api.post('/login', { email, password })
      const { access_token } = res.data
      localStorage.setItem('ss_token', access_token)
      setToken(access_token)
      return { success: true }
    } catch (err) {
      return { success: false, error: err.response?.data?.detail || 'Login failed' }
    } finally {
      setLoading(false)
    }
  }

  const register = async (email, password) => {
    setLoading(true)
    try {
      await api.post('/register', { email, password })
      return { success: true }
    } catch (err) {
      return { success: false, error: err.response?.data?.detail || 'Registration failed' }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('ss_token')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
