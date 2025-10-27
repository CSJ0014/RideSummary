import React from 'react'

function fmtMiles(meters){ return (meters / 1609.344).toFixed(1) }
function fmtDate(iso){ return new Date(iso).toLocaleDateString() }

const typeLabel = (t) => t==='VirtualRide'?'Virtual':'Ride'

export default function Sidebar({activities, selectedId, onSelect, loading, error}){
  return (
    <aside className="sidebar">
      <div className="search">
        <input placeholder="Recent activities" disabled />
      </div>
      {loading && <div>Loading…</div>}
      {error && <div style={{color:'crimson'}}>{error}</div>}
      {activities.map(a => (
        <div
          key={a.id}
          className={"ride-item" + (selectedId===a.id?' active':'')}
          onClick={()=>onSelect(a)}
          role="button"
          tabIndex={0}
        >
          <div style={{display:'flex',flexDirection:'column'}}>
            <strong>{a.name || 'Ride'}</strong>
            <small style={{color:'#60646c'}}>{fmtDate(a.start_date_local)} • {fmtMiles(a.distance)} mi</small>
          </div>
          <span className="badge">{typeLabel(a.type)}</span>
        </div>
      ))}
    </aside>
  )
}
