import React, { useState, useEffect } from "react";
import RideDetails from "./components/RideDetails.jsx";
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

      setDetails(data.details);
      setSeries(data.series);
      setMetrics(data.metrics);
      setZones(data.zones);
    } catch (err) {
      console.error("Error loading activity details:", err);
    }
  };

  return (
    <div className="app-layout">
      {/* === SIDEBAR === */}
      <aside className="sidebar">
        <h2 className="sidebar-title">Recent Activities</h2>

        {activities.length === 0 && (
          <p className="sidebar-loading">Loading activities...</p>
        )}

        <div className="activity-list">
          {activities.map((a) => (
            <button
              key={a.id}
              className={`activity-button ${
                selectedActivity?.id === a.id ? "active" : ""
              }`}
              onClick={() => loadActivityDetails(a)}
            >
              <div className="activity-name">{a.name}</div>
              <div className="activity-meta">
                {new Date(a.start_date_local).toLocaleDateString()} —{" "}
                {(a.distance / 1609).toFixed(1)} mi
              </div>
              <div className="activity-type">{a.type}</div>
            </button>
          ))}
        </div>
      </aside>

      {/* === MAIN DASHBOARD === */}
      <main className="dashboard">
        <div className="top-bar">Strava Dashboard</div>

        <RideDetails
          activity={selectedActivity}
          details={details}
          series={series}
          metrics={metrics}
          zones={zones}
        />
      </main>
    </div>
  );
}
