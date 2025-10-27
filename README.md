# Strava Vite Dashboard (Imperial)

A lightweight Vite + React + Recharts dashboard that lists your 15 most recent Strava rides, shows detailed charts, and lets you export a PDF summary.

## Features
- Sidebar list of last 15 activities (Ride, VirtualRide, GravelRide)
- Click to view details: power+HR overlay, speed+elevation, cadence histogram, zone pie charts
- Export PDF summary of the selected ride
- Serverless /api on Vercel securely refreshes tokens and talks to Strava
- Imperial units by default (miles, feet)

## Local Dev

1. Install deps
```bash
npm i
```

2. Copy `.env.example` to `.env` and fill in values (or set envs in Vercel later).
> Keep secrets out of git.

3. **Run Vercel functions locally** in a separate terminal (for /api):
```bash
npx vercel dev
```

4. Start Vite dev server:
```bash
npm run dev
```

Open http://localhost:5173

## Deploy on Vercel
- Push to GitHub and import the repo in Vercel
- Add these Environment Variables in Vercel Project Settings:

```
STRAVA_CLIENT_ID=...
STRAVA_CLIENT_SECRET=...
STRAVA_REFRESH_TOKEN=...
STRAVA_ACCESS_TOKEN=...   # optional; will be refreshed if expired
```

The frontend references `/api/...` which Vercel serves via Node serverless functions.

## Notes
- We use Strava Streams to render time-series (heartrate, watts, velocity_smooth, altitude, cadence).
- If your account lacks power or HR for a ride, the chart gracefully degrades.
