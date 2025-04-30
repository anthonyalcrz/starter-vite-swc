import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { tempo } from "tempo-devtools/dist/vite";
import path from "path";

export default defineConfig({
  base: "/", // Important for Vercel production deployment
  plugins: [
    react(),
    tempo({
      exclude: ["**/components/auth/passwordchangeform.tsx"],
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    // Allows all external access only when running inside Tempo
    allowedHosts: process.env.TEMPO === "true" ? true : undefined,
  },
});
