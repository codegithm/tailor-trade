import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // load .env files and pick backend URL (supports BACKEND_URL or VITE_BACKEND_URL)
  const env = loadEnv(mode, process.cwd(), "");
  const backend = env.VITE_BACKEND_URL;

  return {
    server: {
      host: "::",
      port: 8080,
      proxy: {
        "/chat": { target: backend, changeOrigin: true, secure: false },
        "/auth": { target: backend, changeOrigin: true, secure: false },
        "/dashboard": { target: backend, changeOrigin: true, secure: false },
        "/design": { target: backend, changeOrigin: true, secure: false },
        "/api": { target: backend, changeOrigin: true, secure: false },
        "/bodygram": { target: backend, changeOrigin: true, secure: false },
      },
    },
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
