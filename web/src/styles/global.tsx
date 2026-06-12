import { createGlobalStyle } from "styled-components";

import { colors, font } from "./theme";

export const GlobalStyle = createGlobalStyle`
  :root {
    color-scheme: light;

    --c-brand50: #ecfdf5;
    --c-brand100: #d1fae5;
    --c-brand300: #6ee7b7;
    --c-brand400: #34d399;
    --c-brand500: #10b981;
    --c-brand600: #059669;
    --c-brand700: #047857;

    --c-slate50: #f8fafc;
    --c-slate100: #f1f5f9;
    --c-slate200: #e2e8f0;
    --c-slate300: #cbd5e1;
    --c-slate400: #94a3b8;
    --c-slate500: #64748b;
    --c-slate600: #475569;
    --c-slate700: #334155;
    --c-slate900: #0f172a;

    --c-red50: #fef2f2;
    --c-red100: #fee2e2;
    --c-red200: #fecaca;
    --c-red500: #ef4444;

    --c-blue50: #eff6ff;
    --c-blue100: #dbeafe;
    --c-blue400: #60a5fa;
    --c-blue500: #3b82f6;
    --c-blue600: #2563eb;
    --c-blue700: #1d4ed8;

    --c-white: #ffffff;
    --c-surface: rgba(255, 255, 255, 0.85);
    --c-surface-border: rgba(15, 23, 42, 0.06);
  }

  [data-theme="dark"] {
    color-scheme: dark;

    --c-brand50: #0e2a22;
    --c-brand100: #123a2e;
    --c-brand300: #6ee7b7;
    --c-brand400: #34d399;
    --c-brand500: #10b981;
    --c-brand600: #34d399;
    --c-brand700: #6ee7b7;

    --c-slate50: #0b1220;
    --c-slate100: #172234;
    --c-slate200: #26334a;
    --c-slate300: #3a4a66;
    --c-slate400: #8b99ae;
    --c-slate500: #a8b4c6;
    --c-slate600: #c6cfdc;
    --c-slate700: #dfe6ef;
    --c-slate900: #f2f6fb;

    --c-red50: #2a1416;
    --c-red100: #3a191c;
    --c-red200: #7f1d1d;
    --c-red500: #f87171;

    --c-blue50: #10203a;
    --c-blue100: #15294a;
    --c-blue400: #60a5fa;
    --c-blue500: #3b82f6;
    --c-blue600: #60a5fa;
    --c-blue700: #93c5fd;

    --c-white: #141d2c;
    --c-surface: rgba(20, 29, 44, 0.72);
    --c-surface-border: rgba(255, 255, 255, 0.08);
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html,
  body,
  #root {
    height: 100%;
  }

  html {
    background: ${colors.slate50};
  }

  body {
    margin: 0;
    background: transparent;
    color: ${colors.slate900};
    font-family: ${font.sans};
    -webkit-font-smoothing: antialiased;
    transition:
      background-color 0.25s ease,
      color 0.25s ease;
  }

  /* Soften the decorative background blobs in dark mode. */
  [data-theme="dark"] .bg-layer {
    opacity: 0.4;
  }
`;
