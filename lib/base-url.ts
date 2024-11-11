export default function getBaseURL() {
  // If executed in the browser (client-side), return an empty string (this shouldn't happen in your case)
  if (typeof window !== "undefined") return "";

  // If executed on the server, return the following:

  // If in production (e.g., deployed on Vercel)
  if (process.env.VERCEL_URL) return `https://${process.env.DOMAIN_URL}`;

  // If not in production (local development)
  return "http://localhost:3000";
}
