import jsPDF from "jspdf";

export default function PdfButton({ activity, details, metrics, zones }) {
  const onClick = () => {
    const doc = new jsPDF();
    const line = (y, label, value) => doc.text(`${label}: ${value}`, 20, y);

    doc.setFontSize(18);
    doc.text(`Ride Summary: ${activity.name}`, 20, 20);

    doc.setFontSize(12);
    line(35, "Date", new Date(activity.start_date_local).toLocaleString());
    line(45, "Distance", `${metrics.distanceMi} mi`);
    line(55, "Moving Time", metrics.time);
    line(65, "Elevation Gain", `${metrics.elevFt} ft`);
    line(75, "Avg Power", metrics.avgPwr);
    line(85, "Avg HR", metrics.avgHr);
    line(95, "Max HR", metrics.maxHr);
    line(105, "Normalized Power", metrics.np);
    line(115, "Intensity Factor", metrics.if);
    line(125, "Training Stress Score", metrics.tss);
    line(135, "HR Drift", metrics.hrDrift);

    doc.text("Power Zones (%)", 20, 155);
    zones.power.forEach((z, i) =>
      doc.text(`Z${i + 1}: ${z}%`, 30, 165 + i * 8)
    );

    doc.text("HR Zones (%)", 100, 155);
    zones.hr.forEach((z, i) =>
      doc.text(`Z${i + 1}: ${z}%`, 110, 165 + i * 8)
    );

    doc.text("Summary:", 20, 210);
    const driftNum = parseFloat(metrics.hrDrift);
    const driftText = isNaN(driftNum)
      ? "insufficient data"
      : driftNum <= 5
      ? "excellent aerobic efficiency"
      : driftNum <= 10
      ? "moderate aerobic stability"
      : "high decoupling — aerobic endurance could improve";

    doc.text(
      `This ride covered ${metrics.distanceMi} miles with ${metrics.elevFt} ft of climbing.
Average power ${metrics.avgPwr} W, normalized power ${metrics.np} W.
Intensity Factor ${metrics.if}, TSS ${metrics.tss}.
Heart rate drift ${metrics.hrDrift} → ${driftText}.`,
      20,
      220,
      { maxWidth: 170 }
    );

    doc.save(`ride-summary-${activity.id}.pdf`);
  };

  return (
    <button className="primary" onClick={onClick}>
      Export Readable PDF
    </button>
  );
}
