const DASHBOARD_API = "https://base-dashboard-zeta.vercel.app/api/track";

export async function trackTransaction({
  appId,
  appName,
  user,
  txHash,
}: {
  appId: string;
  appName: string;
  user: string;
  txHash: string;
}) {
  try {
    await fetch(DASHBOARD_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ appId, appName, user, txHash }),
    });
  } catch (e) {
    console.error("track failed", e);
  }
}
