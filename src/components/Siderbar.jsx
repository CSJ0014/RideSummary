import React, { useEffect, useState } from "react";

export default function Sidebar({ onSelect }) {
  const [rides, setRides] = useState([]);
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    fetch("/api/strava/activities")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const filtered = data.filter((a) =>
            ["Ride", "GravelRide", "VirtualRide"].includes(a.type)
          );
          setRides(filtered.slice(0, 15));
        }
      })
      .catch((err) => console.error("Error fetching activities:", err));
  }, []);

  const chipColor = (type) => {
    switch (type) {
      case "Ride":
        return "#4FC3F7";
      case "GravelRide":
        return "#81C784";
      case "VirtualRide":
        return "#F06292";
      default:
        return "#aaa";
    }
  };

  return (
    <aside
      className="sidebar"
      style={{
        gridArea: "sidebar",
        backgroundColor: "#171923",
        borderRight: "1px solid rgba(255,255,255,0.08)",
        color: "white",
        padding: "16px",
        overflowY: "auto",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      <h2 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: 12 }}>
        Recent Rides
      </h2>
      {rides.length === 0 && (
        <p style={{ fontSize: "0.9rem", color: "#888" }}>Loading...</p>
      )}
      {rides.map((ride) => (
        <div
          key={ride.id}
          onClick={() => {
            setActiveId(ride.id);
            onSelect(ride.id);
          }}
          style={{
            cursor: "pointer",
            backgroundColor:
              activeId === ride.id ? "rgba(142,240,255,0.1)" : "transparent",
            borderRadius: "10px",
            padding: "10px 12px",
            marginBottom: "8px",
            border:
              activeId === ride.id
                ? "1px solid rgba(142,240,255,0.4)"
                : "1px solid transparent",
            transition: "all 0.2s ease",
          }}
        >
          <div
            style={{
              fontWeight: 600,
              fontSize: "0.95rem",
              color: "white",
            }}
          >
            {ride.name}
          </div>
          <div
            style={{
              fontSize: "0.8rem",
              color: "#aaa",
            }}
          >
            {new Date(ride.start_date_local).toLocaleDateString()} •{" "}
            {(ride.distance / 1609.34).toFixed(1)} mi
          </div>
          <div
            style={{
              display: "inline-block",
              marginTop: "6px",
              backgroundColor: chipColor(ride.type),
              color: "black",
              borderRadius: "9999px",
              padding: "2px 8px",
              fontSize: "0.75rem",
              fontWeight: 500,
            }}
          >
            {ride.type === "VirtualRide"
              ? "Virtual"
              : ride.type === "GravelRide"
              ? "Gravel"
              : "Road"}
          </div>
        </div>
      ))}
    </aside>
  );
}
