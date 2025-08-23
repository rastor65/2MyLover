// lib/base-url.ts
import { headers } from "next/headers";

export async function getBaseUrl(): Promise<string> {
  // En cliente, path relativo
  if (typeof window !== "undefined") return "";

  // URL explícita (prod)
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    const url = process.env.NEXT_PUBLIC_SITE_URL;
    return url.startsWith("http") ? url : `https://${url}`;
  }

  // Vercel
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;

  // Fallback: reconstruir con headers
  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (host) return `${proto}://${host}`;

  return "http://localhost:3000";
}
