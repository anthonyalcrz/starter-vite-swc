import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { tempo } from "tempo-devtools/dist/vite";
import path from "path";

export default defineConfig({
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
    // @ts-ignore
    allowedHosts: process.env.TEMPO === "true" ? true : undefined,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined, // Prevents chunk splitting warnings
      },
    },
    chunkSizeWarningLimit: 1200, // Raises default chunk size warning threshold
  },
  define: {
    "process.env": {}, // Compatibility for builds on Vercel
  },
});
