import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import PdfButtonText from "./PdfButtonText.jsx";
import TxtExport from "./TxtExport.jsx";
import { colors, typography, shape, shadows } from "../theme";

export default function RideDetails({ activity, details, series, metrics, zones }) {
  if (!activity || !details || !metrics) {
    return (
      <div className="card" style={{ textAlign: "center", padding: 32 }}>
        <h3 style={{ color: colors.primary }}>Select a ride to view details</h3>
      </div>
    );
  }

  const summaryItems = [
    { label: "Distance", value: `${metrics.distanceMi} mi` },
    { label: "Moving Time", value: metrics.time },
    { label: "Elevation Gain", value: `${metrics.elevFt} ft` },
    { label: "Avg Power", value: `${metrics.avgPwr} W` },
    { label: "Avg HR", value: `${metrics.avgHr} bpm` },
    { label: "Max HR", value: `${metrics.maxHr} bpm` },
    { label: "Normalized Power", value: `${metrics.np} W` },
    { label: "Intensity Factor", value: metrics.if },
    { label: "TSS", value: metrics.tss },
    { label: "HR Drift", value: metrics.hrDrift },
  ];

  return (
    <div className="dashboard" id="ride-report">
      {/* === RIDE SUMMARY === */}
      <div
        className="card"
        style={{
          boxShadow: shadows.medium,
          borderRadius: shape.cardRadius,
          background: colors.surfaceAlt,
        }}
      >
        <h3
          style={{
            color: colors.primary,
            ...typography.titleMedium,
            marginBottom: 16,
          }}
        >
          Ride Summary
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
            gap: "10px 16px",
            marginBottom: 20,
          }}
        >
          {summaryItems.map((item, i) => (
            <div key={i}>
              <div
                style={{
                  fontSize: 13,
                  textTransform: "uppercase",
                  color: colors.primaryDark,
                  fontWeight: 500,
                }}
              >
                {item.label}
              </div>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: colors.onSurface,
                }}
              >
                {item.value}
              </div>
            </div>
          ))}
        </div>

        {/* === EXPORT BUTTONS === */}
        <div style={{ display: "flex", gap: 12 }}>
          <PdfButtonText
            activity={activity}
            details={details}
            metrics={metrics}
            zones={zones}
          />
          <TxtExport
            activity={activity}
            metrics={metrics}
            zones={zones}
          />
        </div>
      </div>

      {/* === CHARTS === */}
      <div
        className="card"
        style={{
          boxShadow: shadows.medium,
          borderRadius: shape.cardRadius,
          background: colors.surfaceAlt,
        }}
      >
        <h3
          style={{
            color: colors.secondary,
            ...typography.titleMedium,
            marginBottom: 8,
          }}
        >
          Power & Heart Rate
        </h3>

        <ResponsiveContainer width="100%" height={320}>
          <LineChart
            data={series}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <XAxis
              dataKey="time"
              stroke={colors.onSurface}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              yAxisId="left"
              stroke={colors.power}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke={colors.hr}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: colors.surfaceAlt,
                borderRadius: "8px",
                border: `1px solid ${colors.outline}`,
                fontSize: "12px",
              }}
              labelStyle={{
                color: colors.onSurface,
                fontWeight: "bold",
              }}
            />
            <Legend
              wrapperStyle={{ paddingTop: 12 }}
              iconType="circle"
              formatter={(value) => (
                <span
                  style={{
                    color: colors.onSurface,
                    fontSize: 13,
                  }}
                >
                  {value}
                </span>
              )}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="power"
              stroke={colors.power}
              strokeWidth={2.2}
              dot={false}
              name="Power (W)"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="hr"
              stroke={colors.hr}
              strokeWidth={1.8}
              dot={false}
              name="Heart Rate (bpm)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
