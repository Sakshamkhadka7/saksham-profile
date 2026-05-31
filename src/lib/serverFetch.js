const BACKEND =
  process.env.BACKEND_URL || "https://latest-profile-backend.onrender.com";

/**
 * Fetch data from the backend on the server side.
 * Returns the unwrapped data array/object, or null on any failure.
 * next.revalidate = 300 → cached for 5 min, then refreshed in the background.
 */
export async function serverFetch(path) {
  try {
    const res = await fetch(`${BACKEND}${path}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? json;
  } catch {
    return null; // view falls back to its own client-side fetch
  }
}
