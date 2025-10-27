import React from "react";
import jsPDF from "jspdf";

export default function TxtExport({ activity, details, metrics, zones }) {
  const exportToPDF = () => {
    if (!activity || !details) return;

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(activity.name || "Ride Summary", 10, 15);

    doc.setFontSize(12);
    doc.text(`Date: ${new Date(activity.start_date_local).toLocaleString()}`, 10, 25);
    doc.text(`Distance: ${(details.distance / 1609).toFixed(1)} mi`, 10, 32);
    doc.text(`Duration: ${(details.moving_time / 60).toFixed(0)} min`, 10, 39);
    doc.text(`Elevation: ${details.total_elevation_gain.toFixed(0)} ft`, 10, 46);

    if (metrics) {
      doc.text(`Avg Power: ${metrics.avg_power ?? "N/A"} W`, 10, 56);
      doc.text(`Avg HR: ${metrics.average_heartrate ?? "N/A"} bpm`, 10, 63);
    }

    doc.save(`${activity.name || "ride"}_summary.pdf`);
  };

  return (
    <button
      onClick={exportToPDF}
      style={{
        background: "linear-gradient(90deg, #E53935, #1E88E5)",
        color: "white",
        border: "none",
        borderRadius: 8,
        padding: "8px 14px",
        cursor: "pointer",
        fontWeight: 500,
        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
      }}
    >
      Export Summary
    </button>
  );
}
