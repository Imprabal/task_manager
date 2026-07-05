import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 8000,
})

export const getTasks = () => api.get('/tasks').then(r => r.data)

export const createTask = (payload) => api.post('/tasks', payload).then(r => r.data)

export const updateTask = (id, payload) =>
  api.put(`/tasks/${id}`, payload).then(r => r.data)

export const deleteTask = (id) => api.delete(`/tasks/${id}`).then(r => r.data)

export const testAlarm = (id) => api.post(`/test-alarm/${id}`).then(r => r.data)

export const stopAlarm = () => api.post(`/stop-alarm`).then(r => r.data)
