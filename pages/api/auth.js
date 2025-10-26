export default function handler(req, res) {
  const clientId = process.env.STRAVA_CLIENT_ID;
  const redirect = process.env.REDIRECT_URI;
  const scope = "activity:read_all";
  const url = `https://www.strava.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirect}&response_type=code&scope=${scope}`;
  res.redirect(url);
}
