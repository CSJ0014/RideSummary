import React, { useState, useEffect } from "react";
import RideDetails from "./components/RideDetails.jsx";
import "./theme.css"; // global MD3 styles
import { colors } from "./theme.js";

export default function App() {
  const [activities, setActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [details, setDetails] = useState(null);
  const [series, setSeries] = useState([]);
  const [metrics, setMetrics] = useState({});
  const [zones, setZones] = useState({});
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Load recent activities
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/activities?per_page=15");
        const data = await res.json();
        setActivities(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Failed to fetch activities:", e);
      }
    })();
  }, []);

  // Load details for a clicked activity
  const loadActivityDetails = async (activity) => {
    setSelectedActivity(activity);
    setLoadingDetails(true);
    setDetails(null);
    try {
      const res = await fetch(`/api/activity/${activity.id}`);
      if (!res.ok) throw new Error("Activity details fetch failed");
      const data = await res.json();
      setDetails(data?.details ?? {});
      setSeries(data?.series ?? []);
      setMetrics(data?.metrics ?? {});
      setZones(data?.zones ?? {});
    } catch (e) {
      console.error("Error loading activity details:", e);
    } finally {
      setLoadingDetails(false);
    }
  };

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <h3 className="sidebar-title">Recent Activities</h3>

        {activities.length === 0 && (
          <p className="sidebar-loading">Loading activities...</p>
        )}

        <div className="activity-list">
          {activities.map((a) => {
            const isActive = selectedActivity?.id === a.id;
            return (
              <button
                key={a.id}
                className={`activity-button ${isActive ? "active" : ""}`}
                onClick={() => loadActivityDetails(a)}
                title={a.name}
              >
                <div className="activity-name">{a.name}</div>
                <div className="activity-meta">
                  {new Date(a.start_date_local).toLocaleDateString()} •{" "}
                  {(a.distance / 1609).toFixed(1)} mi
                </div>
                <div className="activity-type">{a.type}</div>
              </button>
            );
          })}
        </div>
      </aside>

      {/* Main area */}
      <main className="dashboard">
        <div
          className="top-bar"
          style={{
            background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`,
          }}
        >
          Strava Dashboard
        </div>

        {loadingDetails ? (
          <p className="text-muted" style={{ textAlign: "center", marginTop: "20vh" }}>
            Loading ride details…
          </p>
        ) : (
          <RideDetails
            activity={selectedActivity}
            details={details}
            series={series}
            metrics={metrics}
            zones={zones}
          />
        )}
      </main>
    </div>
  );
}
