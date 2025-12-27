import axios from 'axios'

const api = axios.create({
  baseURL: '/api/v1',
})

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const processService = {
  getAll: () => api.get('/processes/'),
  getById: (id) => api.get(`/processes/${id}`),
  create: (data) => api.post('/processes/', data),
  addStep: (id, data) => api.post(`/processes/${id}/steps`, data),
}

export const metricsService = {
  getDashboard: () => api.get('/metrics/'),
}

export const authService = {
  login: (credentials) => api.post('/login/access-token', credentials, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  }),
}

export default api
