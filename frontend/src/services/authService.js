import http from './http'

export const login = (credentials) => http.post('/auth/login', credentials)

export const register = (data) => http.post('/auth/register', data)

export const logout = () => http.post('/auth/logout')

export const getMe = () => http.get('/auth/me')
