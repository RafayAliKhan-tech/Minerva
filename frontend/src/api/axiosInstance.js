import axios from 'axios'

const api = axios.create({
  baseURL: (import.meta.env.VITE_API_BASE_URL || '/backend-api').replace(/\/$/, ''),
  headers: {
    'Content-Type': 'application/json'
  }
})

// Attach token from localStorage on each request
api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token')
      if (token) config.headers.Authorization = `Bearer ${token}`
      if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
        delete config.headers['Content-Type']
        delete config.headers['content-type']
        if (config.headers.common) {
          delete config.headers.common['Content-Type']
          delete config.headers.common['content-type']
        }
      }
    } catch (e) {
      // ignore
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Global response handler: handle 401 by clearing token and redirecting
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      try {
        localStorage.removeItem('token')
        sessionStorage.removeItem('token')
        window.dispatchEvent(new Event('minerva:session-expired'))
      } catch (e) {}
      // redirect to login
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
