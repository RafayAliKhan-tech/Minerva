import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://minerva-backend-g4eq.onrender.com',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Attach token from localStorage on each request
api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('token')
      if (token) config.headers.Authorization = `Bearer ${token}`
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
      } catch (e) {}
      // redirect to login
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
