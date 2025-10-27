import React, { useEffect, useMemo, useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import RideDetails from './components/RideDetails.jsx'
import Header from './components/Header.jsx'
import { listActivities, getActivity, getStreams } from './api/client.js'

export default function App(){
  const [activities, setActivities] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function load(){
      setLoading(true)
      try{
        const acts = await listActivities()
        setActivities(acts)
        if (acts.length) setSelected(acts[0])
      }catch(e){ setError(e.message || 'Failed to fetch activities') }
      finally{ setLoading(false) }
    }
    load()
  }, [])

  return (
    <div className="app">
      <Header />
      <Sidebar
        activities={activities}
        selectedId={selected?.id}
        onSelect={(a)=>setSelected(a)}
        loading={loading}
        error={error}
      />
      <main className="main">
        {selected ? (
          <RideDetails
            activity={selected}
            fetchDetails={() => getActivity(selected.id)}
            fetchStreams={() => getStreams(selected.id)}
          />
        ) : (
          <div className="card">No activity selected.</div>
        )}
      </main>
    </div>
  )
}
