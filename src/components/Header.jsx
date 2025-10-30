import React from "react";

export default function Header() {
  return (
    <header
      className="header"
      style={{
        gridArea: "header",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 24px",
        background: "linear-gradient(90deg, #1b1c1f 0%, #202125 100%)",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        color: "white",
        fontFamily: "Inter, system-ui, sans-serif",
        letterSpacing: "-0.02em",
      }}
    >
      <h1
        style={{
          margin: 0,
          fontSize: "1.25rem",
          fontWeight: 600,
          color: "#8ef0ff",
        }}
      >
        Strava Dashboard
      </h1>
      <div
        style={{
          fontSize: "0.9rem",
          color: "rgba(255,255,255,0.7)",
        }}
      >
        Synced from Strava • {new Date().toLocaleDateString()}
      </div>
    </header>
  );
}
