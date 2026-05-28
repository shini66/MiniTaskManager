import http from './http'

export const getTasks = () => http.get('/tasks/me')

export const createTask = (data) => http.post('/tasks/create', data)

export const updateTask = (id, data) => http.put(`/tasks/update/${id}`, data)

export const deleteTask = (id) => http.delete(`/tasks/delete/${id}`)

export const toggleTask = (id) => http.patch(`/tasks/toggle/${id}`)
