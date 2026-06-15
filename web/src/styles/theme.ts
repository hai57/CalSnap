// Colors are CSS variables so the whole app can switch light/dark at runtime.
// The actual values for each variable live in GlobalStyle (light = :root,
// dark = [data-theme="dark"]). Components keep importing `colors` as before.
export const colors = {
  brand50: "var(--c-brand50)",
  brand100: "var(--c-brand100)",
  brand300: "var(--c-brand300)",
  brand400: "var(--c-brand400)",
  brand500: "var(--c-brand500)",
  brand600: "var(--c-brand600)",
  brand700: "var(--c-brand700)",
  slate50: "var(--c-slate50)",
  slate100: "var(--c-slate100)",
  slate200: "var(--c-slate200)",
  slate300: "var(--c-slate300)",
  slate400: "var(--c-slate400)",
  slate500: "var(--c-slate500)",
  slate600: "var(--c-slate600)",
  slate700: "var(--c-slate700)",
  slate900: "var(--c-slate900)",
  red50: "var(--c-red50)",
  red100: "var(--c-red100)",
  red200: "var(--c-red200)",
  red500: "var(--c-red500)",
  blue50: "var(--c-blue50)",
  blue100: "var(--c-blue100)",
  blue400: "var(--c-blue400)",
  blue500: "var(--c-blue500)",
  blue600: "var(--c-blue600)",
  blue700: "var(--c-blue700)",
  white: "var(--c-white)",
  // Macro fill colors (brighten in dark mode for readability).
  macroProtein: "var(--c-macro-protein)",
  macroCarbs: "var(--c-macro-carbs)",
  macroFat: "var(--c-macro-fat)",
  // Progress/track background (tuned for contrast in both themes).
  track: "var(--c-track)",
  // Always-light text/icon color for use on top of the brand/accent fills.
  onAccent: "#ffffff",
  // Translucent card surface + its hairline border.
  surface: "var(--c-surface)",
  surfaceBorder: "var(--c-surface-border)",
};

export const font = {
  sans: '"Inter", ui-sans-serif, system-ui, sans-serif',
};
