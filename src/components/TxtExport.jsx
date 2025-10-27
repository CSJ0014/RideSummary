export default function TxtExport({ activity, metrics, zones }) {
  const onClick = () => {
    const text = [
      `Ride: ${activity?.name ?? "Ride"}`,
      `Distance: ${metrics?.distanceMi} mi`,
      `Time: ${metrics?.time}`,
      `Elevation: ${metrics?.elevFt} ft`,
      `Avg Power: ${metrics?.avgPwr} W`,
      `Avg HR: ${metrics?.avgHr} bpm`,
      `Max HR: ${metrics?.maxHr} bpm`,
      `NP: ${metrics?.np} W`,
      `IF: ${metrics?.if}`,
      `TSS: ${metrics?.tss}`,
      `HR Drift: ${metrics?.hrDrift}`,
      ``,
      `Power Zones: ${(zones?.power ?? []).join(", ")}`,
      `HR Zones: ${(zones?.hr ?? []).join(", ")}`,
    ].join("\n");

    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ride-summary-${activity?.id ?? "ride"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button className="btn-secondary" onClick={onClick}>
      Export TXT
    </button>
  );
}
