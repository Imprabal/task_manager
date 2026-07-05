import { useState } from 'react'
import toast from 'react-hot-toast'
import { updateTask, deleteTask, testAlarm } from '../api/tasks'

function formatTime(timeStr) {
  const [h, m] = timeStr.split(':').map(Number)
  const suffix = h >= 12 ? 'PM' : 'AM'
  const hour12 = h % 12 || 12
  return `${String(hour12).padStart(2,'0')}:${String(m).padStart(2,'0')} ${suffix}`
}

const ACCENTS = [
  { border: '#0d9488', dot: '#0d9488', text: '#0d9488' },
  { border: '#3b82f6', dot: '#3b82f6', text: '#3b82f6' },
  { border: '#f59e0b', dot: '#f59e0b', text: '#d97706' },
  { border: '#10b981', dot: '#10b981', text: '#059669' },
  { border: '#ec4899', dot: '#ec4899', text: '#db2777' },
  { border: '#06b6d4', dot: '#06b6d4', text: '#0891b2' },
]

export default function TaskCard({ task, index, onUpdate, onDelete }) {
  const [toggling,   setToggling]   = useState(false)
  const [deleting,   setDeleting]   = useState(false)
  const [testing,    setTesting]    = useState(false)
  const [confirmDel, setConfirmDel] = useState(false)

  const accent = ACCENTS[index % ACCENTS.length]

  const handleToggle = async () => {
    setToggling(true)
    try {
      const updated = await updateTask(task.id, { enabled: task.enabled ? 0 : 1 })
      onUpdate(updated)
      toast.success(updated.enabled ? `Alarm enabled for "${updated.name}"` : `Alarm disabled for "${updated.name}"`)
    } catch { toast.error('Failed to update task.') }
    finally { setToggling(false) }
  }

  const handleDelete = async () => {
    if (!confirmDel) { setConfirmDel(true); setTimeout(() => setConfirmDel(false), 3000); return }
    setDeleting(true)
    try { await deleteTask(task.id); onDelete(task.id); toast.success(`"${task.name}" removed.`) }
    catch { toast.error('Failed to delete task.'); setDeleting(false) }
  }

  const handleTest = async () => {
    setTesting(true)
    try { await testAlarm(task.id); toast.success(`🔔 Test alarm fired for "${task.name}"!`) }
    catch { toast.error('Failed to trigger test alarm.') }
    finally { setTimeout(() => setTesting(false), 2000) }
  }

  return (
    <div className="card flex items-center gap-4 px-5 py-4 animate-slide-up transition-opacity duration-300"
         style={{
           borderLeftWidth: '4px',
           borderLeftColor: accent.border,
           opacity: task.enabled ? 1 : 0.55,
         }}>

      <div className="w-2.5 h-2.5 rounded-full shrink-0"
           style={{ background: accent.dot }} />

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm truncate" style={{ color: 'var(--text-1)' }}>{task.name}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xl font-bold font-mono tracking-tight" style={{ color: accent.text }}>
            {formatTime(task.alarm_time)}
          </span>
          <span className="badge text-xs font-medium rounded-full px-2.5 py-0.5"
                style={task.enabled
                  ? { background: 'rgba(16,185,129,0.12)', color: '#10b981', border: '1px solid rgba(16,185,129,0.25)' }
                  : { background: 'var(--bg-elevated)',    color: 'var(--text-3)', border: '1px solid var(--border)' }
                }>
            {task.enabled ? '● Daily' : '○ Off'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">

        <button id={`test-alarm-${task.id}`} onClick={handleTest} disabled={testing || !task.enabled}
          title="Fire alarm now (test)"
          className="p-2 rounded-lg transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ color: 'var(--text-3)', border: '1px solid transparent' }}
          onMouseEnter={e => { e.currentTarget.style.color='#f59e0b'; e.currentTarget.style.borderColor='rgba(245,158,11,0.3)'; e.currentTarget.style.background='rgba(245,158,11,0.08)' }}
          onMouseLeave={e => { e.currentTarget.style.color='var(--text-3)'; e.currentTarget.style.borderColor='transparent'; e.currentTarget.style.background='transparent' }}>
          {testing
            ? <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
            : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
          }
        </button>

        <button id={`toggle-${task.id}`} onClick={handleToggle} disabled={toggling}
          title={task.enabled ? 'Disable alarm' : 'Enable alarm'}
          className="toggle-track disabled:opacity-50"
          style={{ background: task.enabled ? 'var(--accent)' : 'var(--bg-raised)' }}>
          <span className={`toggle-thumb ${task.enabled ? 'translate-x-5' : 'translate-x-0'}`} />
        </button>

        <button id={`delete-${task.id}`} onClick={handleDelete} disabled={deleting}
          title={confirmDel ? 'Click again to confirm' : 'Delete task'}
          className={`p-2 rounded-lg transition-all duration-150 disabled:opacity-30 ${confirmDel ? 'animate-pulse' : ''}`}
          style={{
            color: confirmDel ? '#ef4444' : 'var(--text-3)',
            border: `1px solid ${confirmDel ? 'rgba(239,68,68,0.4)' : 'transparent'}`,
            background: confirmDel ? 'rgba(239,68,68,0.08)' : 'transparent',
          }}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4h6v3M3 7h18"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
