import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const token = router.query.access_token;
  const [rides, setRides] = useState([]);

  useEffect(() => {
    if (token) {
      fetch(`/api/rides?token=${token}`)
        .then((r) => r.json())
        .then((data) => setRides(data));
    }
  }, [token]);

  if (!token)
    return (
      <div style={{ textAlign: "center", marginTop: "4rem" }}>
        <h2>Ride Summary</h2>
        <a href="/api/auth" style={{ fontSize: "1.2rem" }}>Connect with Strava</a>
      </div>
    );

  const handleDownload = () => {
    window.location.href = `/api/pdf?token=${token}`;
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h2 style={{ textAlign: "center" }}>Recent Strava Rides</h2>
      <button onClick={handleDownload} style={{ margin: "1rem auto", display: "block" }}>
        Download PDF
      </button>

      <table style={{
        width: "100%",
        borderCollapse: "collapse",
        textAlign: "left",
        marginTop: "1rem"
      }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #ddd" }}>
            <th>#</th>
            <th>Name</th>
            <th>Type</th>
            <th>Distance (km)</th>
            <th>Time</th>
            <th>Avg Power</th>
            <th>Avg HR</th>
          </tr>
        </thead>
        <tbody>
          {rides.map((a, i) => {
            const dist = (a.distance / 1000).toFixed(1);
            const hrs = Math.floor(a.moving_time / 3600);
            const mins = Math.floor((a.moving_time % 3600) / 60);
            return (
              <tr key={a.id} style={{ borderBottom: "1px solid #eee" }}>
                <td>{i + 1}</td>
                <td>{a.name}</td>
                <td>{a.type}</td>
                <td>{dist}</td>
                <td>{hrs}h {mins}m</td>
                <td>{a.average_watts ?? "–"}</td>
                <td>{a.average_heartrate ?? "–"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
