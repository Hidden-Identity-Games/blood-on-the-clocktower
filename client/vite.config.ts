import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import basicSsl from "@vitejs/plugin-basic-ssl";
const PORT = 3000;
// https://vitejs.dev/config/
export default defineConfig((env) => ({
  plugins: [react(), basicSsl()],
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
    },
  },
  define: {
    WS_URL:
      env.command === "build"
        ? '"wss://blood-on-the-clocktower.onrender.com/socket"'
        : `\`wss://\${window.location.hostname}:${PORT}/api/socket\``,
  },
}));
