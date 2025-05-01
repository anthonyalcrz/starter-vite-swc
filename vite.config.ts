import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ["tempo-routes"], // ✅ Prevents Vercel build crash
    },
  },
});
