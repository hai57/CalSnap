import { Platform } from "react-native";

// Base URL of the FastAPI backend.
//   - iOS simulator: http://localhost:8000 works
//   - Android emulator: use http://10.0.2.2:8000 (the host loopback)
//   - Physical device: use your computer's LAN IP, e.g. http://192.168.1.20:8000
//
// Override by editing this value for your environment.
const DEV_HOST = Platform.select({
  android: "http://10.0.2.2:8000",
  default: "http://localhost:8000",
});

export const API_URL = DEV_HOST as string;

export function resolveImageUrl(url: string | null): string | null {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  return `${API_URL}${url}`;
}
