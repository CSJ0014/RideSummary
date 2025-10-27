import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { colors, shadows, shape, typography } from "../theme.js";
import PdfButtonText from "./PdfButtonText.jsx";
import "../theme.css";

export default function RideDetails({ activity, details, series, metrics, zones }) {
  if (!activity) {
    return (
      <div className="card">
        <h3>No ride selected</h3>
        <p className="text-muted">
          Select a ride from the sidebar to view its detailed analysis.
        </p>
      </div>
    );
  }

  // Format helper
  const fmt = (val, unit = "") =>
    val !== undefined && val !== null ? `${val.toFixed(1)}${unit}` : "—";

  return (
    <div className="ride-details">
      {/* === HEADER CARD === */}
      <div className="card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h3 style={{ color: colors.primary, marginBottom: 4 }}>
              {activity.name}
            </h3>
            <p style={{ margin: 0, opacity: 0.8 }}>
              {new Date(activity.start_date_local).toLocaleString()}
            </p>
            <p style={{ margin: 0, color: colors.secondary, fontWeight: 500 }}>
              {activity.type}
            </p>
          </div>
          <PdfButtonText
            data={{ activity, details, metrics }}
            fileName={`${activity.name.replace(/\s+/g, "_")}_summary.pdf`}
          />
        </div>
      </div>

      {/* === SUMMARY METRICS === */}
      <div className="card">
        <h3>Summary Metrics</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "0.75rem",
            marginTop: "0.5rem",
          }}
        >
          <div><strong>Distance:</strong> {fmt(activity.distance / 1609, " mi")}</div>
          <div><strong>Moving Time:</strong> {(activity.moving_time / 60).toFixed(0)} min</div>
          <div><strong>Avg Speed:</strong> {fmt(activity.average_speed * 2.23694, " mph")}</div>
          <div><strong>Avg Power:</strong> {fmt(metrics.avg_power, " W")}</div>
          <div><strong>HR Drift:</strong> {fmt(metrics.hr_drift, "%")}</div>
          <div><strong>Elevation Gain:</strong> {fmt(activity.total_elevation_gain * 3.281, " ft")}</div>
        </div>
      </div>

      {/* === POWER + HR CHART === */}
      <div className="chart-container">
        <div className="chart-title">Power & Heart Rate Over Time</div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={series}>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.outline} />
            <XAxis dataKey="time" tick={{ fontSize: 11 }} />
            <YAxis
              yAxisId="left"
              orientation="left"
              stroke={colors.primary}
              label={{
                value: "Power (W)",
                angle: -90,
                position: "insideLeft",
                fill: colors.primary,
                fontSize: 12,
              }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke={colors.secondary}
              label={{
                value: "Heart Rate (bpm)",
                angle: 90,
                position: "insideRight",
                fill: colors.secondary,
                fontSize: 12,
              }}
            />
            <Tooltip />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="power"
              stroke={colors.primary}
              dot={false}
              strokeWidth={2}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="heart_rate"
              stroke={colors.secondary}
              dot={false}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* === ZONE DISTRIBUTION (Optional Future) === */}
      {zones && Object.keys(zones).length > 0 && (
        <div className="card">
          <h3>Time in Zones</h3>
          <ul style={{ paddingLeft: "1rem", margin: 0 }}>
            {Object.entries(zones).map(([zone, value]) => (
              <li key={zone}>
                <strong>{zone}:</strong> {fmt(value, " min")}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
