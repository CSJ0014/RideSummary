async function api(path){
  const res = await fetch(`/api${path}`)
  if(!res.ok){
    const t = await res.text()
    throw new Error(`API ${path} failed: ${res.status} ${t}`)
  }
  return res.json()
}

export function listActivities(){
  return api('/activities?per_page=15')
}
export function getActivity(id){
  return api(`/activity/${id}`)
}
export function getStreams(id){
  // heartrate, watts, velocity_smooth, altitude, cadence, time
  return api(`/streams/${id}?keys=heartrate,watts,velocity_smooth,altitude,cadence,time`)
}
