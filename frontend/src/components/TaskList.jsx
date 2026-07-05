import { useState } from 'react'
import TaskCard from './TaskCard'

const FILTERS = ['All', 'Active', 'Disabled']

export default function TaskList({ tasks, loading, onUpdate, onDelete }) {
  const [filter, setFilter] = useState('All')

  const filtered = tasks.filter(t => {
    if (filter === 'Active')  return t.enabled === 1
    if (filter === 'Disabled') return t.enabled === 0
    return true
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--text-2)' }}>
          Scheduled Lectures
          {tasks.length > 0 && (
            <span className="ml-2 font-bold text-base normal-case" style={{ color: 'var(--accent)' }}>
              ({tasks.length})
            </span>
          )}
        </h2>

        <div className="flex gap-1.5 p-1 rounded-xl" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
          {FILTERS.map(f => (
            <button key={f} id={`filter-${f.toLowerCase()}`} onClick={() => setFilter(f)}
              className="px-3 py-1 text-xs font-medium rounded-lg transition-all duration-150"
              style={filter === f
                ? { background: 'var(--accent)', color: '#fff' }
                : { color: 'var(--text-3)' }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => (
            <div key={i} className="card px-5 py-4 flex items-center gap-4 animate-pulse">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--bg-raised)' }} />
              <div className="flex-1 space-y-2">
                <div className="h-3 rounded w-1/3" style={{ background: 'var(--bg-raised)' }} />
                <div className="h-5 rounded w-1/4" style={{ background: 'var(--bg-raised)' }} />
              </div>
              <div className="flex gap-2">
                {[1,2,3].map(j => <div key={j} className="w-8 h-8 rounded-lg" style={{ background: 'var(--bg-raised)' }} />)}
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-16 text-center animate-fade-in">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
               style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
            <span className="text-3xl">📭</span>
          </div>
          <p className="font-medium" style={{ color: 'var(--text-2)' }}>
            {tasks.length === 0 ? 'No lectures scheduled yet' : `No ${filter.toLowerCase()} lectures`}
          </p>
          <p className="text-sm mt-1" style={{ color: 'var(--text-3)' }}>
            {tasks.length === 0 ? 'Add your first lecture using the form above.' : 'Switch the filter to see other tasks.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((task, idx) => (
            <TaskCard key={task.id} task={task} index={idx} onUpdate={onUpdate} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  )
}
