import React from 'react'

export default function Header(){
  return (
    <header>
      <div className="brand">
        <span className="dot"></span>
        <span>Strava Dashboard</span>
      </div>
      <div className="actions">
        <a href="https://www.strava.com/settings/api" target="_blank" rel="noreferrer">
          <button className="ghost">Strava API</button>
        </a>
      </div>
    </header>
  )
}
