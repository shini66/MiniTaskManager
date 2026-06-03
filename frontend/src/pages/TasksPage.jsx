import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { createTask, deleteTask, getTasks, toggleTask, updateTask } from '../services/taskService'
import TaskCard from '../components/TaskCard'
import TaskModal from '../components/TaskModal'

export default function TasksPage() {
  const { user, logout } = useAuth()

  const [tasks, setTasks] = useState([])

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  const [totalTasks, setTotalTasks] = useState(0)
  const [totalPages, setTotalPages] = useState(1)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // null = cerrado | undefined = nueva tarea | task object = editar
  const [modalTask, setModalTask] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)

  const fetchTasks = useCallback(async () => {
    try {
      const { data } = await getTasks({ search, status, page, limit })
      // Normalizar id (usa _id de Mongoose si no existe `id`)
      setTasks(data.tasks.map((t) => ({ ...t, id: t.id || t._id })))
      setTotalTasks(data.totalTasks || 0)
      setTotalPages(data.totalPages || 1)
    } catch {
      setError('No se pudieron cargar las tareas')
    } finally {
      setLoading(false)
    }
  }, [search, status, page, limit])

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

  const handleSearchChange = (e) => {
    setSearch(e.target.value)
    setPage(1)
  }

  const handleStatusChange = (e) => {
    setStatus(e.target.value)
    setPage(1)
  }

  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value))
    setPage(1)
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

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Buscar tareas..."
            value={search}
            onChange={handleSearchChange}
            className="flex-1 border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          <select
            value={status}
            onChange={handleStatusChange}
            className="border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Todas</option>
            <option value="pending">Pendientes</option>
            <option value="completed">Completadas</option>
          </select>
        </div>

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
        {!loading && totalTasks === 0 && (
          <p className="text-gray-400 text-sm text-center mt-8">
            Todavía no tenés tareas. ¡Creá una!
          </p>
        )}

        

        <section>
          <div className="flex items-center justify-between gap-6 my-4">
            <select
              value={limit}
              onChange={handleLimitChange}
              className="border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={5}>5 por página</option>
              <option value={10}>10 por página</option>
              <option value={20}>20 por página</option>
            </select>

            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Total de tareas ({totalTasks})
            </h2>

            <div className="flex items-center gap-3">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 transition-opacity"
              >
                {"<"}
              </button>
              
              <span className="text-sm text-gray-600 font-medium">
                {page} / {totalPages}
              </span>
              
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 transition-opacity"
              >
                {">"}
              </button>
            </div>
          </div>

          <ul className="flex flex-col gap-2">
            {tasks.map((task) => (
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

      </main>

      {/* Modal */}
      {modalOpen && (
        <TaskModal task={modalTask} onClose={closeModal} onSave={handleSave} />
      )}
    </div>
  )
}
