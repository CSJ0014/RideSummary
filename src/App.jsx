import React, { useState, useEffect } from "react";
import RideDetails from "./components/RideDetails.jsx";

export default function App() {
  const [activities, setActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [details, setDetails] = useState(null);
  const [series, setSeries] = useState([]);
  const [metrics, setMetrics] = useState({});
  const [zones, setZones] = useState({});

  // === FETCH RECENT ACTIVITIES ===
  useEffect(() => {
    async function loadActivities() {
      try {
        const res = await fetch("/api/activities?per_page=15");
        const data = await res.json();
        setActivities(data || []);
      } catch (err) {
        console.error("Failed to fetch activities:", err);
      }
    }
    loadActivities();
  }, []);

  // === LOAD ACTIVITY DETAILS ON CLICK ===
  const loadActivityDetails = async (activity) => {
    setSelectedActivity(activity);
    try {
      const res = await fetch(`/api/activity/${activity.id}`);
      const data = await res.json();
      setDetails(data.details);
      setSeries(data.series);
      setMetrics(data.metrics);
      setZones(data.zones);
    } catch (err) {
      console.error("Error loading activity details:", err);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "#f7f8fa",
        fontFamily: "Inter, sans-serif",
        color: "#222",
      }}
    >
      {/* === SIDEBAR === */}
      <div
        style={{
          width: "300px",
          background: "#fff",
          borderRight: "1px solid #ddd",
          padding: "20px",
          overflowY: "auto",
        }}
      >
        <h2 style={{ color: "#2e7d32", marginBottom: "16px" }}>Recent Rides</h2>
        {activities.length === 0 ? (
          <p>Loading activities...</p>
        ) : (
          activities.map((a) => (
            <button
              key={a.id}
              onClick={() => loadActivityDetails(a)}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                background:
                  selectedActivity?.id === a.id ? "#e8f5e9" : "transparent",
                border:
                  selectedActivity?.id === a.id
                    ? "1px solid #2e7d32"
                    : "1px solid transparent",
                borderRadius: "6px",
                padding: "10px 12px",
                marginBottom: "8px",
                cursor: "pointer",
                transition: "0.2s",
              }}
            >
              <div style={{ fontWeight: 600 }}>{a.name}</div>
              <div style={{ fontSize: 13, opacity: 0.8 }}>
                {new Date(a.start_date_local).toLocaleDateString()} •{" "}
                {(a.distance / 1609).toFixed(1)} mi
              </div>
              <div style={{ fontSize: 12, color: "#2e7d32" }}>{a.type}</div>
            </button>
          ))
        )}
      </div>

      {/* === MAIN DASHBOARD === */}
      <div
        style={{
          flex: 1,
          padding: 24,
          overflowY: "auto",
        }}
      >
        <div
          style={{
            marginBottom: 20,
            background: "#2e7d32",
            color: "white",
            padding: "12px 20px",
            borderRadius: "8px",
            fontWeight: 600,
            boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
          }}
        >
          Strava Dashboard
        </div>

        <RideDetails
          activity={selectedActivity}
          details={details}
          series={series}
          metrics={metrics}
          zones={zones}
        />
      </div>
    </div>
  );
}
