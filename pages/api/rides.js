export default async function handler(req, res) {
  const { token } = req.query;
  const actResp = await fetch("https://www.strava.com/api/v3/athlete/activities?per_page=20", {
    headers: { Authorization: `Bearer ${token}` }
  });
  const activities = await actResp.json();
  res.status(200).json(activities);
}
