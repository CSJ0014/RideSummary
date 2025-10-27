import jsPDF from "jspdf";

export default function PdfButtonText({ activity, details, metrics, zones }) {
  const onClick = () => {
    console.log("[TEXT PDF] generator running");           // <— visible in devtools
    const stamp = `Text PDF v2 • ${new Date().toISOString()}`;
    const doc = new jsPDF();

    // Version stamp so we can visually confirm the build
    doc.setFontSize(9);
    doc.text(stamp, 20, 10);

    const line = (y, label, value) => doc.text(`${label}: ${value}`, 20, y);

    doc.setFontSize(18);
    doc.text(`Ride Summary: ${activity?.name ?? "Ride"}`, 20, 22);

    doc.setFontSize(12);
    line(35, "Date", new Date(details?.start_date_local ?? activity?.start_date_local ?? Date.now()).toLocaleString());
    line(45, "Distance", `${metrics?.distanceMi ?? "—"} mi`);
    line(55, "Moving Time", metrics?.time ?? "—");
    line(65, "Elevation Gain", `${metrics?.elevFt ?? "—"} ft`);
    line(75, "Avg Power", `${metrics?.avgPwr ?? "—"} W`);
    line(85, "Avg HR", `${metrics?.avgHr ?? "—"} bpm`);
    line(95, "Max HR", `${metrics?.maxHr ?? "—"} bpm`);
    line(105, "Normalized Power", `${metrics?.np ?? "—"} W`);
    line(115, "Intensity Factor", `${metrics?.if ?? "—"}`);
    line(125, "Training Stress Score", `${metrics?.tss ?? "—"}`);
    line(135, "HR Drift", `${metrics?.hrDrift ?? "—"}`);

    doc.text("Power Zones (%)", 20, 155);
    (zones?.power ?? []).forEach((z, i) => doc.text(`Z${i + 1}: ${z}%`, 30, 165 + i * 8));

    doc.text("HR Zones (%)", 100, 155);
    (zones?.hr ?? []).forEach((z, i) => doc.text(`Z${i + 1}: ${z}%`, 110, 165 + i * 8));

    const driftNum = parseFloat((metrics?.hrDrift ?? "").toString().replace("%",""));
    const driftText = Number.isFinite(driftNum)
      ? (driftNum <= 5 ? "excellent aerobic efficiency"
        : driftNum <= 10 ? "moderate aerobic stability"
        : "high decoupling — aerobic endurance could improve")
      : "insufficient data";

    doc.text("Summary:", 20, 210);
    doc.text(
      `This ride covered ${metrics?.distanceMi ?? "—"} miles with ${metrics?.elevFt ?? "—"} ft of climbing.
Average power ${metrics?.avgPwr ?? "—"} W, normalized power ${metrics?.np ?? "—"} W.
Intensity Factor ${metrics?.if ?? "—"}, TSS ${metrics?.tss ?? "—"}.
Heart rate drift ${metrics?.hrDrift ?? "—"} → ${driftText}.`,
      20,
      220,
      { maxWidth: 170 }
    );

    // Note the filename includes TEXT to confirm path used
    doc.save(`ride-summary-TEXT-${activity?.id ?? "ride"}.pdf`);
  };

  return <button className="primary" onClick={onClick}>Export Readable PDF (TEXT)</button>;
}
