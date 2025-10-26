import PDFDocument from "pdfkit";
import { buffer } from "micro";

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  const { token } = req.query;
  const actResp = await fetch("https://www.strava.com/api/v3/athlete/activities?per_page=20", {
    headers: { Authorization: `Bearer ${token}` }
  });
  const activities = await actResp.json();

  const doc = new PDFDocument();
  const chunks = [];
  doc.on("data", (chunk) => chunks.push(chunk));
  doc.on("end", () => {
    const pdf = Buffer.concat(chunks);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=rides.pdf");
    res.send(pdf);
  });

  doc.fontSize(20).text("Recent Strava Rides", { align: "center" });
  doc.moveDown();
  activities.forEach((a, i) => {
    doc.fontSize(12).text(
      `${i + 1}. ${a.name} | ${(a.distance / 1000).toFixed(1)} km | ${a.moving_time / 60} min | ${a.type}`
    );
  });
  doc.end();
}
