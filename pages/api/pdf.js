import PDFDocument from "pdfkit";

export default async function handler(req, res) {
  const { token } = req.query;
  const actResp = await fetch("https://www.strava.com/api/v3/athlete/activities?per_page=20", {
    headers: { Authorization: `Bearer ${token}` }
  });
  const activities = await actResp.json();

  const doc = new PDFDocument({ margin: 40 });
  const chunks = [];
  doc.on("data", (c) => chunks.push(c));
  doc.on("end", () => {
    const pdf = Buffer.concat(chunks);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=rides.pdf");
    res.send(pdf);
  });

  doc.fontSize(20).text("Recent Strava Rides", { align: "center" }).moveDown();
  doc.fontSize(12);

  activities.forEach((a, i) => {
    const dist = (a.distance / 1000).toFixed(1);
    const hrs = Math.floor(a.moving_time / 3600);
    const mins = Math.floor((a.moving_time % 3600) / 60);
    doc.text(`${i + 1}. ${a.name}`);
    doc.text(`Type: ${a.type} | Distance: ${dist} km | Time: ${hrs}h ${mins}m | Avg Power: ${a.average_watts || "–"} | HR: ${a.average_heartrate || "–"}`);
    doc.moveDown(0.5);
  });
  doc.end();
}
