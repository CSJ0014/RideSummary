import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const token = router.query.access_token;

  const fetchPDF = () => {
    window.location.href = `/api/rides?token=${token}`;
  };

  if (!token)
    return (
      <div style={{ textAlign: "center", marginTop: "4rem" }}>
        <a href="/api/auth">Connect with Strava</a>
      </div>
    );

  return (
    <div style={{ textAlign: "center", marginTop: "4rem" }}>
      <h2>Connected to Strava ✅</h2>
      <button onClick={fetchPDF}>Download Latest 20 Rides (PDF)</button>
    </div>
  );
}
