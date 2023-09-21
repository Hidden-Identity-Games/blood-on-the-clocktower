import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import basicSsl from "@vitejs/plugin-basic-ssl";
const PORT = 3000;
// https://vitejs.dev/config/

const HTTPS = true;
export default defineConfig((env) => ({
  plugins: [react(), HTTPS && basicSsl()],
  build: {
    minify: false,
    sourcemap: true,
    rollupOptions: {},
  },
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:6001",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
        ws: true,
      },
      "/trpc": {
        target: "http://localhost:3001",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/trpc/, ""),
      },
    },
  },
  define: {
    WS_URL:
      env.command === "build"
        ? process.env.WS_URL ??
          '"wss://blood-on-the-clocktower.onrender.com/socket"'
        : `\`ws${
            HTTPS ? "s" : ""
          }://\${window.location.hostname}:${PORT}/api/socket\``,
  },
}));
