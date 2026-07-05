import { useState } from 'react'
import toast from 'react-hot-toast'
import { createTask } from '../api/tasks'

const PRESETS = ['DA 101', 'Machine Learning', 'Data Structures', 'Algorithms', 'DBMS', 'Computer Networks', 'OS', 'Math']

export default function AddTaskForm({ onAdd }) {
  const [name,    setName]    = useState('')
  const [time,    setTime]    = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim() || !time) { toast.error('Please fill in both the lecture name and time.'); return }
    setLoading(true)
    try {
      const newTask = await createTask({ name: name.trim(), alarm_time: time })
      onAdd(newTask)
      toast.success(`"${newTask.name}" scheduled at ${newTask.alarm_time} 🎉`)
      setName(''); setTime('')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create task.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card p-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-5">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg"
             style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
               style={{ color: 'var(--accent)' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
          </svg>
        </div>
        <h2 className="text-base font-semibold" style={{ color: 'var(--text-1)' }}>Schedule a New Lecture</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="task-name" className="block text-xs font-medium mb-1.5 uppercase tracking-wider"
                   style={{ color: 'var(--text-3)' }}>Lecture / Subject</label>
            <input id="task-name" type="text" className="input" placeholder="e.g. Machine Learning"
                   value={name} onChange={e => setName(e.target.value)} maxLength={60} autoComplete="off" />
          </div>
          <div>
            <label htmlFor="task-time" className="block text-xs font-medium mb-1.5 uppercase tracking-wider"
                   style={{ color: 'var(--text-3)' }}>Alarm Time (HH:MM)</label>
            <input id="task-time" type="time" className="input" value={time} onChange={e => setTime(e.target.value)} />
          </div>
        </div>

        <div>
          <p className="text-xs mb-2 uppercase tracking-wider font-medium" style={{ color: 'var(--text-3)' }}>Quick Presets</p>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map(p => (
              <button key={p} type="button" onClick={() => setName(p)}
                className="px-3 py-1 text-xs rounded-lg font-medium transition-all duration-150"
                style={{
                  border: `1px solid ${name === p ? 'var(--accent)' : 'var(--border)'}`,
                  background: name === p ? 'var(--bg-elevated)' : 'transparent',
                  color: name === p ? 'var(--accent)' : 'var(--text-2)',
                }}>
                {p}
              </button>
            ))}
          </div>
        </div>

        <button id="submit-task-btn" type="submit" disabled={loading} className="btn-primary w-full sm:w-auto">
          {loading ? (
            <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
            </svg>Scheduling…</>
          ) : (
            <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
            </svg>Add Lecture</>
          )}
        </button>
      </form>
    </div>
  )
}
