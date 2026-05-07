import axios from 'axios'

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || ''}/api`,
  headers: { 'Content-Type': 'application/json' },
})

// Simple request deduplication map
const pendingRequests = new Map<string, Promise<any>>()

// Attach JWT token on every request
api.interceptors.request.use((config) => {
  try {
    const authStorage = localStorage.getItem('lms-auth')
    if (authStorage) {
      const { state } = JSON.parse(authStorage)
      if (state.token) {
        config.headers.Authorization = `Bearer ${state.token}`
      }
    }
  } catch (err) {
    console.error('Error parsing auth storage:', err)
  }
  return config
})

// Proper request deduplication using a promise cache
const activeRequests = new Map<string, Promise<any>>()

const originalGet = api.get
api.get = (url: string, config?: any) => {
  const key = `${url}${JSON.stringify(config?.params || {})}`
  
  if (activeRequests.has(key)) {
    return activeRequests.get(key) as any
  }

  const promise = originalGet(url, config).finally(() => {
    activeRequests.delete(key)
  })

  activeRequests.set(key, promise)
  return promise
}

// Handle 401 — clear session and redirect
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      const isPublicPage = ['/', '/landing', '/login', '/register'].includes(window.location.pathname)
      if (!isPublicPage) {
        localStorage.removeItem('lms-auth') 
        window.location.href = '/login'
      }
    }
    return Promise.reject(err)
  }
)

export default api
