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
import { colors, shadows, shape, typography } from "../theme.js";
import TxtExport from "./TxtExport.jsx";

export default function RideDetails({ activity, details, series, metrics, zones }) {
  // === EARLY RETURN: no ride selected ===
  if (!activity) {
    return (
      <div
        style={{
          ...typography.bodyLarge,
          color: colors.onSurface,
          textAlign: "center",
          marginTop: "20vh",
        }}
      >
        Select a ride from the sidebar to view analysis.
      </div>
    );
  }

  // === EARLY RETURN: still loading ===
  if (!details || !metrics) {
    return (
      <div
        style={{
          ...typography.bodyLarge,
          color: colors.onSurface,
          textAlign: "center",
          marginTop: "20vh",
        }}
      >
        Loading ride data...
      </div>
    );
  }

  // === SAFE METRIC VALUES ===
  const distance = (details?.distance / 1609)?.toFixed(1) || 0;
  const avgPower = metrics?.avg_power ?? 0;
  const maxPower = metrics?.max_power ?? 0;
  const avgHr = metrics?.average_heartrate ?? 0;
  const movingTime = metrics?.moving_time ?? 0;
  const elevation = details?.total_elevation_gain ?? 0;

  // === TIME FORMATTING ===
  const hours = Math.floor(movingTime / 3600);
  const minutes = Math.floor((movingTime % 3600) / 60);

  // === CHART DATA ===
  const hasSeries = Array.isArray(series) && series.length > 0;
  const chartData =
    hasSeries &&
    series
      .filter((d) => d.watts != null && d.heartrate != null)
      .map((d, i) => ({
        index: i,
        power: d.watts,
        hr: d.heartrate,
      }));

  // === GUARD: No usable chart data ===
  if (!chartData || chartData.length === 0) {
    return (
      <div
        style={{
          ...typography.bodyLarge,
          color: colors.onSurface,
          textAlign: "center",
          marginTop: "20vh",
        }}
      >
        No stream data available for this ride.
      </div>
    );
  }

  return (
    <div
      style={{
        background: colors.surface,
        color: colors.onSurface,
        padding: 24,
        borderRadius: shape.cardRadius,
        boxShadow: shadows.large,
      }}
    >
      {/* === HEADER SECTION === */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
          borderBottom: `1px solid ${colors.outlineVariant}`,
          paddingBottom: 8,
        }}
      >
        <div>
          <h2
            style={{
              ...typography.titleLarge,
              color: colors.primary,
              margin: 0,
            }}
          >
            {activity.name}
          </h2>
          <p
            style={{
              ...typography.bodyLarge,
              color: colors.onSurfaceVariant,
              marginTop: 4,
            }}
          >
            {new Date(activity.start_date_local).toLocaleDateString()} •{" "}
            {distance} mi • {hours > 0 ? `${hours}h ` : ""}
            {minutes}m
          </p>
        </div>
        <TxtExport
          activity={activity}
          details={details}
          metrics={metrics}
          zones={zones}
        />
      </div>

      {/* === METRIC SUMMARY GRID === */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: 12,
          marginBottom: 24,
        }}
      >
        {[
          { label: "Avg Power", value: `${avgPower} W` },
          { label: "Max Power", value: `${maxPower} W` },
          { label: "Avg HR", value: `${avgHr} bpm` },
          { label: "Elevation", value: `${elevation.toFixed(0)} ft` },
        ].map((m) => (
          <div
            key={m.label}
            style={{
              background: colors.surfaceVariant,
              borderRadius: shape.cardRadius,
              padding: "12px 16px",
              boxShadow: shadows.small,
            }}
          >
            <div
              style={{
                ...typography.labelSmall,
                textTransform: "uppercase",
                color: colors.onSurfaceVariant,
                marginBottom: 4,
              }}
            >
              {m.label}
            </div>
            <div
              style={{
                ...typography.titleMedium,
                color: colors.primary,
              }}
            >
              {m.value}
            </div>
          </div>
        ))}
      </div>

      {/* === POWER vs HEART RATE CHART === */}
      <div
        style={{
          background: colors.surfaceVariant,
          borderRadius: shape.cardRadius,
          padding: 20,
          boxShadow: shadows.medium,
        }}
      >
        <h3
          style={{
            ...typography.titleMedium,
            color: colors.onSurface,
            marginBottom: 12,
          }}
        >
          Power vs Heart Rate
        </h3>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.outline} />
            <XAxis
              dataKey="index"
              tick={false}
              label={{
                value: "Time",
                position: "insideBottomRight",
                offset: -5,
                fill: colors.onSurfaceVariant,
              }}
            />
            <YAxis
              yAxisId="left"
              label={{
                value: "Power (W)",
                angle: -90,
                position: "insideLeft",
                offset: 10,
                fill: colors.onSurfaceVariant,
              }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              label={{
                value: "Heart Rate (bpm)",
                angle: 90,
                position: "insideRight",
                offset: 10,
                fill: colors.onSurfaceVariant,
              }}
            />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="power"
              stroke={colors.primary}
              strokeWidth={2}
              dot={false}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="hr"
              stroke={colors.secondary}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
