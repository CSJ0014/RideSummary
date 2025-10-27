import { sfetch } from './_utils/strava.js'

export default async function handler(req, res){
  try{
    const per = Number(req.query.per_page||15)
    const activities = await sfetch(`/athlete/activities?per_page=${per}`)
    const filtered = activities.filter(a => ['Ride','VirtualRide','GravelRide'].includes(a.type))
    res.setHeader('Content-Type','application/json')
    res.status(200).send(JSON.stringify(filtered))
  }catch(e){
    res.status(500).send(String(e.message||e))
  }
}
