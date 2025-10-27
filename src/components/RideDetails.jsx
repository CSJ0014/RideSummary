import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import TxtExport from "./TxtExport.jsx";

export default function RideDetails({ activity, details, series, metrics, zones }) {
  if (!activity)
    return (
      <div style={{ textAlign: "center", marginTop: "20vh" }}>
        Select a ride from the sidebar.
      </div>
    );

  if (!details || !metrics)
    return (
      <div style={{ textAlign: "center", marginTop: "20vh" }}>
        Loading ride data...
      </div>
    );

  const distance = (details.distance / 1609).toFixed(1);
  const avgPower = metrics.avg_power ?? 0;
  const avgHr = metrics.average_heartrate ?? 0;
  const elevation = details.total_elevation_gain ?? 0;
  const movingTime = metrics.moving_time ?? 0;
  const hours = Math.floor(movingTime / 3600);
  const minutes = Math.floor((movingTime % 3600) / 60);

  const chartData = Array.isArray(series)
    ? series.map((d, i) => ({
        index: i,
        power: d.watts ?? 0,
        hr: d.heartrate ?? 0,
      }))
    : [];

  return (
    <div
      style={{
        background: "#fff",
        padding: 20,
        borderRadius: 8,
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <div>
          <h2 style={{ color: "#2e7d32", margin: 0 }}>{activity.name}</h2>
          <p style={{ opacity: 0.8 }}>
            {new Date(activity.start_date_local).toLocaleDateString()} •{" "}
            {distance} mi • {hours > 0 ? `${hours}h ` : ""}
            {minutes}m
          </p>
        </div>
        <TxtExport activity={activity} details={details} metrics={metrics} />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: 12,
          marginBottom: 20,
        }}
      >
        {[{ label: "Avg Power", value: `${avgPower} W` },
          { label: "Avg HR", value: `${avgHr} bpm` },
          { label: "Elevation", value: `${elevation.toFixed(0)} ft` },
        ].map((m) => (
          <div
            key={m.label}
            style={{
              background: "#e8f5e9",
              borderRadius: 6,
              padding: "10px 14px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 13, opacity: 0.7 }}>{m.label}</div>
            <div style={{ fontSize: 18, fontWeight: 600, color: "#2e7d32" }}>
              {m.value}
            </div>
          </div>
        ))}
      </div>

      {chartData.length > 0 ? (
        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
              <XAxis dataKey="index" tick={false} />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="power"
                stroke="#2e7d32"
                strokeWidth={2}
                dot={false}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="hr"
                stroke="#ff6f00"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p style={{ textAlign: "center", opacity: 0.7 }}>
          No stream data available.
        </p>
      )}
    </div>
  );
}
