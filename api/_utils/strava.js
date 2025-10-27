const STRAVA_TOKEN_URL = 'https://www.strava.com/oauth/token'
const API_BASE = 'https://www.strava.com/api/v3'

export async function getAccessToken(){
  // If STRAVA_ACCESS_TOKEN provided, we could trust, but we still try refresh each time for reliability.
  const cid = process.env.STRAVA_CLIENT_ID
  const secret = process.env.STRAVA_CLIENT_SECRET
  const refresh = process.env.STRAVA_REFRESH_TOKEN

  if(!cid || !secret || !refresh){
    throw new Error('Missing STRAVA_* environment variables on the server.')
  }

  const res = await fetch(STRAVA_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: cid,
      client_secret: secret,
      grant_type: 'refresh_token',
      refresh_token: refresh
    })
  })
  if(!res.ok){
    const t = await res.text()
    throw new Error(`Failed to refresh token: ${res.status} ${t}`)
  }
  const json = await res.json()
  return json.access_token
}

export async function sfetch(path, init={}){
  const token = await getAccessToken()
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { ...(init.headers||{}), Authorization: `Bearer ${token}` }
  })
  if(!res.ok){
    const t = await res.text()
    throw new Error(`Strava ${path} failed: ${res.status} ${t}`)
  }
  return res.json()
}
