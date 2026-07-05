import { useState, useEffect } from 'react'
import { stopAlarm } from '../api/tasks'
import toast from 'react-hot-toast'

function LiveDot() {
  return (
    <span className="relative flex h-2 w-2">
      <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: 'var(--accent)' }} />
    </span>
  )
}

function SunIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="5"/>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
    </svg>
  )
}

export default function Header({ backendOnline, darkMode, toggleTheme }) {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const timeStr = time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })
  const dateStr = time.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })

  const handleStopAlarm = async () => {
    try {
      await stopAlarm()
      toast.success('Alarm stopped.')
    } catch (err) {
      toast.error('Failed to stop alarm.')
    }
  }

  return (
    <header className="sticky top-0 z-30 backdrop-blur-md"
      style={{ borderBottom: '1px solid var(--border)', background: darkMode ? 'rgba(30, 41, 59, 0.85)' : 'rgba(255, 255, 255, 0.85)' }}>
      <div>
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">

          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg shadow-sm"
                 style={{ background: 'var(--accent)' }}>
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight" style={{ color: 'var(--text-1)' }}>
                Study Task Manager
              </h1>
              <p className="text-xs font-medium" style={{ color: 'var(--text-3)' }}>Daily Lecture Scheduler</p>
            </div>
          </div>

          <div className="flex items-center gap-3">

            <div className="hidden sm:flex items-center gap-2 rounded-lg px-3 py-1.5"
                 style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
              {backendOnline ? <LiveDot /> : <span className="w-2.5 h-2.5 rounded-full bg-danger" />}
              <span className="text-xs font-medium" style={{ color: 'var(--text-2)' }}>
                {backendOnline ? 'Scheduler Active' : 'Backend Offline'}
              </span>
            </div>

            <div className="text-right hidden md:block">
              <p className="text-sm font-bold font-mono tracking-wider" style={{ color: 'var(--text-1)' }}>{timeStr}</p>
              <p className="text-xs" style={{ color: 'var(--text-3)' }}>{dateStr}</p>
            </div>

            <button
              onClick={handleStopAlarm}
              title="Stop ringing alarm"
              className="flex items-center justify-center gap-1.5 px-3 h-9 rounded-lg transition-all duration-200"
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#ef4444',
                fontWeight: '600',
                fontSize: '0.8rem'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)' }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="hidden sm:inline">STOP ALARM</span>
            </button>

            <button
              id="theme-toggle"
              onClick={toggleTheme}
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              className="flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200"
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                color: 'var(--text-2)',
              }}
            >
              {darkMode ? <SunIcon /> : <MoonIcon />}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
