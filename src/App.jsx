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
  const [loadingDetails, setLoadingDetails] = useState(false);

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
    setLoadingDetails(true);
    setDetails(null);
    try {
      const res = await fetch(`/api/activity/${activity.id}`);
      if (!res.ok) throw new Error("Activity details fetch failed");
      const data = await res.json();
      setDetails(data.details || {});
      setSeries(data.series || []);
      setMetrics(data.metrics || {});
      setZones(data.zones || {});
    } catch (err) {
      console.error("Error loading activity details:", err);
    } finally {
      setLoadingDetails(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: colors.background,
      }}
    >
      {/* === SIDEBAR === */}
      <div
        style={{
          width: 260,
          background: colors.surface,
          borderRight: `1px solid ${colors.outlineVariant}`,
          overflowY: "auto",
          padding: 12,
        }}
      >
        <h3
          style={{
            ...typography.titleMedium,
            color: colors.onSurfaceVariant,
            marginBottom: 12,
          }}
        >
          Recent Activities
        </h3>

        {activities.length === 0 && (
          <p style={{ color: colors.onSurfaceVariant }}>Loading activities...</p>
        )}

        {activities.map((a) => {
          const isActive = selectedActivity?.id === a.id;
          return (
            <button
              key={a.id}
              onClick={() => loadActivityDetails(a)}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                border: "none",
                outline: "none",
                background: isActive
                  ? `rgba(229, 57, 53, 0.1)`
                  : colors.surface,
                color: colors.onSurface,
                borderRadius: shape.cardRadius,
                boxShadow: isActive ? shadows.small : "none",
                padding: "10px 12px",
                marginBottom: 8,
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background =
                  "rgba(25, 118, 210, 0.08)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = isActive
                  ? `rgba(229, 57, 53, 0.1)`
                  : colors.surface)
              }
            >
              <div
                style={{
                  ...typography.titleSmall,
                  color: colors.onSurface,
                  fontWeight: 600,
                }}
              >
                {a.name}
              </div>
              <div
                style={{
                  ...typography.labelSmall,
                  color: colors.onSurfaceVariant,
                  opacity: 0.9,
                }}
              >
                {new Date(a.start_date_local).toLocaleDateString()} •{" "}
                {(a.distance / 1609).toFixed(1)} mi
              </div>
              <div
                style={{
                  ...typography.labelSmall,
                  color: colors.secondary,
                  marginTop: 2,
                }}
              >
                {a.type}
              </div>
            </button>
          );
        })}
      </div>

      {/* === MAIN DASHBOARD === */}
      <div
        style={{
          flex: 1,
          padding: 24,
          overflowY: "auto",
          background: colors.surfaceContainerLowest,
        }}
      >
        {/* === TOP BAR === */}
        <div
          style={{
            marginBottom: 20,
            background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`,
            color: "white",
            padding: "14px 22px",
            borderRadius: shape.cardRadius,
            boxShadow: shadows.medium,
            ...typography.titleLarge,
          }}
        >
          Strava Dashboard
        </div>

        {/* === RIDE DETAILS === */}
        {loadingDetails ? (
          <p
            style={{
              ...typography.bodyLarge,
              color: colors.onSurfaceVariant,
              textAlign: "center",
              marginTop: "20vh",
            }}
          >
            Loading ride details...
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
      </div>
    </div>
  );
}
