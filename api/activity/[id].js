import { sfetch } from '../_utils/strava.js'

export default async function handler(req, res){
  try{
    const { id } = req.query
    const activity = await sfetch(`/activities/${id}`)
    res.setHeader('Content-Type','application/json')
    res.status(200).send(JSON.stringify(activity))
  }catch(e){
    res.status(500).send(String(e.message||e))
  }
}
