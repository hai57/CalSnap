import path from "node:path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const sharedDir = path.resolve(__dirname, "../shared");

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@shared": sharedDir,
    },
  },
  server: {
    port: 5173,
    // Allow importing the sibling shared/ package which lives outside web/.
    fs: { allow: [path.resolve(__dirname, ".."), __dirname] },
  },
});
