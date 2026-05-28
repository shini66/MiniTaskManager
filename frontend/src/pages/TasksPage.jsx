import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { createTask, deleteTask, getTasks, toggleTask, updateTask } from '../services/taskService'
import TaskCard from '../components/TaskCard'
import TaskModal from '../components/TaskModal'

export default function TasksPage() {
  const { user, logout } = useAuth()

  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // null = cerrado | undefined = nueva tarea | task object = editar
  const [modalTask, setModalTask] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)

  const fetchTasks = useCallback(async () => {
    try {
      const { data } = await getTasks()
      // Normalizar id (usa _id de Mongoose si no existe `id`)
      setTasks(data.map((t) => ({ ...t, id: t.id || t._id })))
    } catch {
      setError('No se pudieron cargar las tareas')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const openCreate = () => {
    setModalTask(undefined)
    setModalOpen(true)
  }

  const openEdit = (task) => {
    setModalTask(task)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setModalTask(null)
  }

  const handleSave = async (form) => {
    if (modalTask) {
      const { data } = await updateTask(modalTask.id, form)
      const normalized = { ...data, id: data.id || data._id }
      setTasks((prev) => prev.map((t) => (t.id === normalized.id ? normalized : t)))
    } else {
      const { data } = await createTask(form)
      const normalized = { ...data, id: data.id || data._id }
      setTasks((prev) => [normalized, ...prev])
    }
  }

  const handleToggle = async (id) => {
    const { data } = await toggleTask(id)
    const normalized = { ...data, id: data.id || data._id }
    setTasks((prev) => prev.map((t) => (t.id === normalized.id ? normalized : t)))
  }

  const handleDelete = async (id) => {
    await deleteTask(id)
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  const pending = tasks.filter((t) => !t.completed)
  const completed = tasks.filter((t) => t.completed)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-800">Mis tareas</h1>
            {user && (
              <p className="text-xs text-gray-400">Hola, {user.user}</p>
            )}
          </div>
          <button
            onClick={logout}
            className="text-sm text-gray-500 hover:text-red-500 transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-6">
        {/* Botón nueva tarea */}
        <button
          onClick={openCreate}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition-colors shadow-sm"
        >
          + Nueva tarea
        </button>

        {/* Error general */}
        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        {/* Loading */}
        {loading && (
          <p className="text-gray-400 text-sm text-center">Cargando tareas...</p>
        )}

        {/* Sin tareas */}
        {!loading && tasks.length === 0 && (
          <p className="text-gray-400 text-sm text-center mt-8">
            Todavía no tenés tareas. ¡Creá una!
          </p>
        )}

        {/* Pendientes */}
        {pending.length > 0 && (
          <section>
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Pendientes ({pending.length})
            </h2>
            <ul className="flex flex-col gap-2">
              {pending.map((task) => (
                <li key={task.id}>
                  <TaskCard
                    task={task}
                    onToggle={handleToggle}
                    onEdit={openEdit}
                    onDelete={handleDelete}
                  />
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Completadas */}
        {completed.length > 0 && (
          <section>
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Completadas ({completed.length})
            </h2>
            <ul className="flex flex-col gap-2">
              {completed.map((task) => (
                <li key={task.id}>
                  <TaskCard
                    task={task}
                    onToggle={handleToggle}
                    onEdit={openEdit}
                    onDelete={handleDelete}
                  />
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>

      {/* Modal */}
      {modalOpen && (
        <TaskModal task={modalTask} onClose={closeModal} onSave={handleSave} />
      )}
    </div>
  )
}
