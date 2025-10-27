import { sfetch } from '../_utils/strava.js'

export default async function handler(req, res){
  try{
    const { id } = req.query
    const keys = req.query.keys || 'heartrate,watts,velocity_smooth,altitude,cadence,time'
    const streamsArr = await sfetch(`/activities/${id}/streams?keys=${encodeURIComponent(keys)}&key_by_type=true`)
    // Ensure key_by_type=true style output; Strava already returns as object in this mode
    res.setHeader('Content-Type','application/json')
    res.status(200).send(JSON.stringify(streamsArr))
  }catch(e){
    res.status(500).send(String(e.message||e))
  }
}
