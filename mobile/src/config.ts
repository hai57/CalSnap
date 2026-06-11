// Base URL of the FastAPI backend.
//
// On a PHYSICAL phone (Expo Go), "localhost" points at the phone itself, so you
// must use your computer's LAN IP. Prefer setting it once in mobile/.env:
//
//   EXPO_PUBLIC_API_URL=http://192.168.1.21:8000
//
// The LAN fallback below is only used when that var is not set.
// If you need an Android emulator later, set EXPO_PUBLIC_API_URL=http://10.0.2.2:8000.
//
// NOTE: also start the backend on 0.0.0.0 so the phone can reach it:
//   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
const LAN_HOST = "http://192.168.1.21:8000";

const DEV_HOST = process.env.EXPO_PUBLIC_API_URL ?? LAN_HOST;

export const API_URL = DEV_HOST as string;

export function resolveImageUrl(url: string | null): string | null {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  return `${API_URL}${url}`;
}
