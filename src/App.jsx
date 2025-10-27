import React, { useState, useEffect } from "react";
import RideDetails from "./components/RideDetails.jsx";
import { colors, shadows, shape, typography } from "./theme.js";
import "./theme.css";

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

  // === LOAD DETAILS ON CLICK ===
  const loadActivityDetails = async (activity) => {
    setSelectedActivity(activity);
    try {
      const res = await fetch(`/api/activity/${activity.id}`);
      const data = await res.json();

      // expected structure from backend
      setDetails(data.details);
      setSeries(data.series);
      setMetrics(data.metrics);
      setZones(data.zones);
    } catch (err) {
      console.error("Error loading activity details:", err);
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: colors.surface }}>
      {/* === SIDEBAR === */}
      <div className="sidebar">
        <h2>Recent activities</h2>
        {activities.length === 0 && (
          <p style={{ color: colors.onSurface }}>Loading activities...</p>
        )}
        {activities.map((a) => (
          <button
            key={a.id}
            onClick={() => loadActivityDetails(a)}
            style={{
              background:
                selectedActivity?.id === a.id
                  ? "rgba(30, 136, 229, 0.1)"
                  : "transparent",
              border: selectedActivity?.id === a.id ? `1px solid ${colors.secondary}` : "none",
            }}
          >
            <div style={{ fontWeight: 600 }}>{a.name}</div>
            <div style={{ fontSize: 13, opacity: 0.8 }}>
              {new Date(a.start_date_local).toLocaleDateString()} —{" "}
              {(a.distance / 1609).toFixed(1)} mi
            </div>
            <div style={{ fontSize: 12, color: colors.secondary }}>
              {a.type}
            </div>
          </button>
        ))}
      </div>

      {/* === MAIN DASHBOARD === */}
      <div
        className="dashboard"
        style={{
          flex: 1,
          padding: 24,
          overflowY: "auto",
          background: colors.surface,
        }}
      >
        {/* === TOP BAR === */}
        <div
          className="top-bar"
          style={{
            marginBottom: 20,
            background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`,
            color: "white",
            padding: "12px 20px",
            borderRadius: shape.buttonRadius,
            boxShadow: shadows.medium,
            ...typography.titleMedium,
          }}
        >
          Strava Dashboard
        </div>

        {/* === RIDE DETAILS VIEW === */}
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
