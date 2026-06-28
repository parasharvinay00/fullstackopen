import { apiClient } from './apiClient'

const register = credentials => {
  return apiClient
    .post('/users', credentials, { skipAuthHandling: true })
    .then(response => response.data)
}

const login = credentials => {
  return apiClient
    .post('/login', credentials, { skipAuthHandling: true })
    .then(response => response.data)
}

export default {
  login,
  register,
}
