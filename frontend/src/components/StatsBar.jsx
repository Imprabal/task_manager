function StatCard({ icon, label, value, accent }) {
  return (
    <div className="card flex items-center gap-4 px-5 py-4 flex-1 min-w-0"
         style={accent ? { borderColor: 'var(--accent)' } : {}}>
      <div className="flex items-center justify-center w-10 h-10 rounded-xl shrink-0"
           style={{ background: accent ? 'var(--accent)' : 'var(--bg-elevated)', color: accent ? '#ffffff' : 'inherit' }}>
        <span className="text-lg">{icon}</span>
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wider truncate" style={{ color: 'var(--text-3)' }}>
          {label}
        </p>
        <p className="text-xl font-bold mt-0.5 truncate" style={{ color: 'var(--text-1)' }}>{value}</p>
      </div>
    </div>
  )
}

export default function StatsBar({ tasks }) {
  const total    = tasks.length
  const active   = tasks.filter(t => t.enabled).length
  const disabled = total - active

  const getNextAlarm = () => {
    if (!active) return '—'
    const now    = new Date()
    const nowMin = now.getHours() * 60 + now.getMinutes()
    const upcoming = tasks
      .filter(t => t.enabled)
      .map(t => { const [h,m] = t.alarm_time.split(':').map(Number); return { name: t.name, totalMin: h*60+m, time: t.alarm_time } })
      .filter(t => t.totalMin > nowMin)
      .sort((a,b) => a.totalMin - b.totalMin)
    return upcoming.length ? `${upcoming[0].name} @ ${upcoming[0].time}` : 'Tomorrow ↗'
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full">
      <StatCard icon="📚" label="Total Lectures" value={total} />
      <StatCard icon="🔔" label="Active Alarms"  value={active}   accent={active > 0} />
      <StatCard icon="🔕" label="Disabled"        value={disabled} />
      <StatCard icon="⏰" label="Next Alarm"      value={getNextAlarm()} />
    </div>
  )
}
