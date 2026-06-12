export interface Palette {
  brand: string;
  brandDark: string;
  brandLight: string;
  bg: string;
  card: string;
  text: string;
  muted: string;
  border: string;
  danger: string;
  dangerSoft: string;
  dangerBorder: string;
  protein: string;
  carbs: string;
  fat: string;
  blue: string;
  blueDark: string;
  blueLight: string;
  blueSoft: string;
  chipBg: string;
}

export const lightColors: Palette = {
  brand: "#10b981",
  brandDark: "#059669",
  brandLight: "#d1fae5",
  bg: "#f8fafc",
  card: "#ffffff",
  text: "#0f172a",
  muted: "#64748b",
  border: "#e2e8f0",
  danger: "#ef4444",
  dangerSoft: "#fef2f2",
  dangerBorder: "#fecaca",
  protein: "#3b82f6",
  carbs: "#f59e0b",
  fat: "#ef4444",
  blue: "#2563eb",
  blueDark: "#1d4ed8",
  blueLight: "#dbeafe",
  blueSoft: "#eff6ff",
  chipBg: "#f1f5f9",
};

export const darkColors: Palette = {
  brand: "#34d399",
  brandDark: "#10b981",
  brandLight: "#0f3d30",
  bg: "#0b1220",
  card: "#131c30",
  text: "#e7edf6",
  muted: "#94a3b8",
  border: "#27334a",
  danger: "#f87171",
  dangerSoft: "#2a1517",
  dangerBorder: "#5b2327",
  protein: "#60a5fa",
  carbs: "#fbbf24",
  fat: "#f87171",
  blue: "#60a5fa",
  blueDark: "#3b82f6",
  blueLight: "#1e3a5f",
  blueSoft: "#16243d",
  chipBg: "#1c2740",
};

export type ColorScheme = "light" | "dark";

// Live palette. Mutated in place so existing `colors.x` reads stay reactive
// after a theme switch + remount. Defaults to light.
export const colors: Palette = { ...lightColors };

export function applyPalette(scheme: ColorScheme): void {
  Object.assign(colors, scheme === "dark" ? darkColors : lightColors);
}
