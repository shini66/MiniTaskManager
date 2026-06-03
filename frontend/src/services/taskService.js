import http from './http'

export const getTasks = async ({search, status, page, limit}) => http.get('/tasks/me', { params: { search, status, page, limit } })

export const createTask = (data) => http.post('/tasks/create', data)

export const updateTask = (id, data) => http.put(`/tasks/update/${id}`, data)

export const deleteTask = (id) => http.delete(`/tasks/delete/${id}`)

export const toggleTask = (id) => http.patch(`/tasks/toggle/${id}`)
