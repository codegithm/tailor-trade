import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // load .env files and pick backend URL (supports BACKEND_URL or VITE_BACKEND_URL)
  const env = loadEnv(mode, process.cwd(), "");
  const backend =
    env.BACKEND_URL || env.VITE_BACKEND_URL || "http://localhost:4000";

  return {
    server: {
      host: "::",
      port: 8080,
      proxy: {
        "/chat": backend,
        "/auth": backend,
        "/dashboard": backend,
        "/design": backend,
        "/api": backend,
        "/bodygram": backend,
      },
    },
    plugins: [react(), mode === "development" && componentTagger()].filter(
      Boolean
    ),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
