import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import basicSsl from "@vitejs/plugin-basic-ssl";
const SERVER_PORT: number = Number(process.env.SERVER_PORT);
const CLIENT_PORT: number = Number(process.env.CLIENT_PORT ?? 3000);
console.log(`SERVER ON: ${SERVER_PORT}`);
console.log(`CLIENT ON: ${CLIENT_PORT}`);

const HTTPS = true;
export default defineConfig((env) => ({
  plugins: [react(), HTTPS && basicSsl()],
  build: {
    minify: false,
    sourcemap: true,
    rollupOptions: {},
  },
  server: {
    port: CLIENT_PORT,
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
        ? process.env.SERVER_URL ??
          '"wss://blood-on-the-clocktower.onrender.com/trpc"'
        : `\`\${window.location.hostname}:${CLIENT_PORT}/api\``,
  },
}));
