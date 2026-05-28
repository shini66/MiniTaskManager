import { createContext, useContext, useEffect, useState } from 'react'
import { login as loginService, register as registerService, logout as logoutService, getMe } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setLoading(false)
      return
    }
    getMe()
      .then(({ data }) => setUser(data))
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false))
  }, [])

  const login = async (credentials) => {
    const { data } = await loginService(credentials)
    localStorage.setItem('token', data.token)
    setUser(data.user)
  }

  const register = async (formData) => {
    const { data } = await registerService(formData)
    localStorage.setItem('token', data.token)
    setUser(data.user)
  }

  const logout = async () => {
    await logoutService().catch(() => {})
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
