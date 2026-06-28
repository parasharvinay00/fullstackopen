import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'

const apiClient = axios.create({
  baseURL,
})

let authToken = null
let unauthorizedHandler = null

apiClient.interceptors.request.use(config => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`
  }

  return config
})

apiClient.interceptors.response.use(
  response => response,
  error => {
    if (
      error.response?.status === 401 &&
      !error.config?.skipAuthHandling &&
      typeof unauthorizedHandler === 'function'
    ) {
      unauthorizedHandler()
    }

    return Promise.reject(error)
  }
)

const setToken = token => {
  authToken = token
}

const clearToken = () => {
  authToken = null
}

const setUnauthorizedHandler = handler => {
  unauthorizedHandler = handler
}

export {
  apiClient,
  clearToken,
  setToken,
  setUnauthorizedHandler,
}
