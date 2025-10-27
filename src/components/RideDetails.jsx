import React, { useEffect, useMemo, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts'
import PdfButton from './PdfButton.jsx'

const COLORS = ['#2E7D32','#66BB6A','#81C784','#A5D6A7','#C8E6C9','#E8F5E9']

function mToMiles(m){ return m/1609.344 }
function mToFeet(m){ return m*3.28084 }
function sToHMS(s){
  const h = Math.floor(s/3600)
  const m = Math.floor((s%3600)/60)
  const sec = s%60
  return [h,m,sec].map(x=>String(x).padStart(2,'0')).join(':')
}

export default function RideDetails({activity, fetchDetails, fetchStreams}){
  const [details, setDetails] = useState(null)
  const [streams, setStreams] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(()=>{
    let alive = true
    async function load(){
      setLoading(true); setError(null)
      try{
        const [d,s] = await Promise.all([fetchDetails(), fetchStreams()])
        if(!alive) return
        setDetails(d); setStreams(s)
      }catch(e){ setError(e.message || 'Failed to load ride') }
      finally{ setLoading(false) }
    }
    load()
    return ()=>{ alive=false }
  }, [activity.id])

  const series = useMemo(()=>{
    if(!streams) return []
    const time = streams.time?.data || []
    const hr = streams.heartrate?.data || []
    const watts = streams.watts?.data || streams.power?.data || []
    const speed = streams.velocity_smooth?.data || []
    const alt = streams.altitude?.data || []
    const cad = streams.cadence?.data || []
    const data = time.map((t,i)=>({
      t, 
      min: (t/60).toFixed(1),
      hr: hr[i] ?? null,
      watts: watts[i] ?? null,
      mph: speed[i]!=null ? speed[i]*2.23694 : null,
      elev: alt[i]!=null ? mToFeet(alt[i]) : null,
      cad: cad[i] ?? null
    }))
    return data
  }, [streams])

  const metrics = useMemo(()=>{
    if(!details) return null
    return {
      distanceMi: mToMiles(details.distance).toFixed(1),
      time: sToHMS(details.moving_time),
      elevFt: Math.round(mToFeet(details.total_elevation_gain)).toLocaleString(),
      avgHr: details.average_heartrate ?? '—',
      maxHr: details.max_heartrate ?? '—',
      avgPwr: details.average_watts ?? '—',
      kJ: details.kilojoules ? Math.round(details.kilojoules) : '—',
    }
  }, [details])

  const zones = useMemo(()=>{
    // simple sample zones for demo; replace with user settings if desired
    if(!series.length) return { power: [], hr: [] }
    const pwr = [0,120,160,200,240,300,10000] // watts cutoffs
    const hrz = [0,110,130,145,160,175,250]
    const countBins = (arr, accessor, cuts)=>{
      const bins = new Array(cuts.length-1).fill(0)
      arr.forEach(row=>{
        const v = accessor(row)
        if(v==null) return
        const idx = cuts.findIndex((c,i)=> v>=cuts[i] && v<cuts[i+1])
        if(idx>=0) bins[idx]++
      })
      const total = bins.reduce((a,b)=>a+b,0)||1
      return bins.map(b=>Math.round(100*b/total))
    }
    return {
      power: countBins(series, r=>r.watts, pwr),
      hr: countBins(series, r=>r.hr, hrz)
    }
  }, [series])

  return (
    <div className="grid" id="ride-report">
      <div className="grid cols-3">
        <div className="metric"><h4>Distance</h4><div>{metrics?.distanceMi} mi</div></div>
        <div className="metric"><h4>Moving Time</h4><div>{metrics?.time}</div></div>
        <div className="metric"><h4>Elevation Gain</h4><div>{metrics?.elevFt} ft</div></div>
        <div className="metric"><h4>Avg Power</h4><div>{metrics?.avgPwr}</div></div>
        <div className="metric"><h4>Avg HR</h4><div>{metrics?.avgHr}</div></div>
        <div className="metric"><h4>Max HR</h4><div>{metrics?.maxHr}</div></div>
      </div>

      <div className="actions" style={{marginTop:8}}>
        <PdfButton filename={`ride-summary-${activity.id}.pdf`} />
      </div>

      {loading && <div className="card">Loading charts…</div>}
      {error && <div className="card" style={{color:'crimson'}}>{String(error)}</div>}

      {!loading && !error && (
        <>
          <div className="card">
            <div className="chart-title">Power (W) & Heart Rate (bpm) over time</div>
            <div style={{width:'100%', height:300}}>
              <ResponsiveContainer>
                <LineChart data={series}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="min" tick={{fontSize:12}} />
                  <YAxis yAxisId="left" tick={{fontSize:12}} />
                  <YAxis yAxisId="right" orientation="right" tick={{fontSize:12}} />
                  <Tooltip />
                  <Line yAxisId="left" type="monotone" dataKey="watts" stroke="#2E7D32" dot={false} strokeWidth={2}/>
                  <Line yAxisId="right" type="monotone" dataKey="hr" stroke="#43A047" dot={false} strokeWidth={2}/>
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid cols-2">
            <div className="card">
              <div className="chart-title">Speed (mph) & Elevation (ft)</div>
              <div style={{width:'100%', height:260}}>
                <ResponsiveContainer>
                  <AreaChart data={series}>
                    <defs>
                      <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#43A047" stopOpacity={0.6}/>
                        <stop offset="95%" stopColor="#43A047" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="min" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="mph" stroke="#2E7D32" fillOpacity={1} fill="url(#g1)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="card">
              <div className="chart-title">Cadence (rpm) distribution</div>
              <div style={{width:'100%', height:260}}>
                <ResponsiveContainer>
                  <BarChart data={bucket(series.map(d=>d.cad), 10, v=>v)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#66BB6A" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="grid cols-2">
            <div className="card">
              <div className="chart-title">Power Zones (%)</div>
              <PieChart width={400} height={260}>
                <Pie data={zones.power.map((v,i)=>({name:`Z${i+1}`, value:v}))} innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value">
                  {zones.power.map((_,i)=>(<Cell key={i} fill={COLORS[i%COLORS.length]} />))}
                </Pie>
                <Legend />
              </PieChart>
            </div>
            <div className="card">
              <div className="chart-title">HR Zones (%)</div>
              <PieChart width={400} height={260}>
                <Pie data={zones.hr.map((v,i)=>({name:`Z${i+1}`, value:v}))} innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value">
                  {zones.hr.map((_,i)=>(<Cell key={i} fill={COLORS[i%COLORS.length]} />))}
                </Pie>
                <Legend />
              </PieChart>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// simple bucketing for bar histogram
function bucket(values, size=10, accessor=x=>x){
  const nums = values.filter(v=>Number.isFinite(v)).map(accessor)
  if(!nums.length) return []
  const max = Math.max(...nums)
  const min = Math.min(...nums)
  const step = Math.max(1, Math.round((max-min)/size))
  const buckets = []
  for(let start = Math.floor(min/step)*step; start <= max; start += step){
    const end = start+step
    const count = nums.filter(v=>v>=start && v<end).length
    buckets.push({label: `${start}-${end}`, count})
  }
  return buckets
}
