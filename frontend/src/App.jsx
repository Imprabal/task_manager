import { useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'
import { getTasks } from './api/tasks'
import Header    from './components/Header'
import StatsBar  from './components/StatsBar'
import AddTaskForm from './components/AddTaskForm'
import TaskList  from './components/TaskList'

export default function App() {
  const [tasks,         setTasks]         = useState([])
  const [loading,       setLoading]       = useState(true)
  const [backendOnline, setBackendOnline] = useState(false)

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme')
    return saved ? saved === 'dark' : false
  })

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  const toggleTheme = () => setDarkMode(d => !d)

  const fetchTasks = useCallback(async (showLoader = false) => {
    if (showLoader) setLoading(true)
    try {
      const data = await getTasks()
      setTasks(data)
      setBackendOnline(true)
    } catch {
      setBackendOnline(false)
      if (showLoader) toast.error('Cannot reach backend. Is Flask running on port 5000?')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTasks(true)
    const interval = setInterval(() => fetchTasks(false), 30_000)
    return () => clearInterval(interval)
  }, [fetchTasks])

  const handleAdd    = (t)  => setTasks(prev => [...prev, t].sort((a,b) => a.alarm_time.localeCompare(b.alarm_time)))
  const handleUpdate = (t)  => setTasks(prev => prev.map(x => x.id === t.id ? t : x))
  const handleDelete = (id) => setTasks(prev => prev.filter(x => x.id !== id))

  return (
    <div style={{ minHeight: '100vh' }}>
      <Header backendOnline={backendOnline} darkMode={darkMode} toggleTheme={toggleTheme} />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {!backendOnline && !loading && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium animate-fade-in"
               style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444' }}>
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
            Backend offline — run <code className="mx-1 px-1.5 py-0.5 rounded text-xs" style={{ background: 'rgba(0,0,0,0.1)' }}>python3 app.py</code> in the backend/ directory.
          </div>
        )}

        <StatsBar tasks={tasks} />
        <AddTaskForm onAdd={handleAdd} />
        <TaskList tasks={tasks} loading={loading} onUpdate={handleUpdate} onDelete={handleDelete} />

        <footer className="text-center text-xs py-4" style={{ color: 'var(--text-3)' }}>
          Study Task Manager — local-first · Scheduler checks every 10 s
        </footer>
      </main>
    </div>
  )
}
