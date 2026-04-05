import axios from 'axios'

const BASE_URL = 'http://localhost:8000'

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Attach token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ss_token')
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})

// Analyze text for AI detection
export const analyzeText = (text) =>
  api.post('/analyze-text', { text })

// Analyze message for phishing
export const analyzePhishing = (text) =>
  api.post('/analyze-phishing', { text })

// Analyze URL
export const analyzeURL = (url) =>
  api.post('/analyze-url', { url })

// Generate PDF report
export const generateReport = async (input_text, analysis_result) => {
  const response = await api.post(
    '/generate-report',
    { input_text, analysis_result },
    { responseType: 'blob' }
  )
  return response
}
