import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Si ya está autenticado, redirige a /tasks (evita entrar a login/register)
export default function PublicRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400 text-sm">Cargando...</p>
      </div>
    )
  }

  return user ? <Navigate to="/tasks" replace /> : children
}
