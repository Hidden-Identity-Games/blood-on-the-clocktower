import basicSsl from "@vitejs/plugin-basic-ssl";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vitest/config";
const TEST_MODE: boolean = !!process.env.TEST_MODE;
const SERVER_PORT: number = Number(process.env.SERVER_PORT);
const CLIENT_PORT: number = Number(process.env.CLIENT_PORT ?? 3000);
console.log(`SERVER ON: ${SERVER_PORT}`);
console.log(`CLIENT ON: ${CLIENT_PORT}`);
console.log(`TEST_MODE: ${TEST_MODE}`);

const HTTPS = true;
export default defineConfig((env) => ({
  resolve: {
    alias: {
      "@design-system": path.resolve(__dirname, "./src/design-system"),
    },
  },
  test: {
    setupFiles: "./test/testSetup.tsx",
    environment: "jsdom",
  },
  plugins: [react(), HTTPS && basicSsl()],
  build: {
    minify: false,
    sourcemap: true,
    rollupOptions: {},
  },
  server: {
    watch: {
      ignored: ["!node_modules/@hidden-identity/**/*"],
    },
    port: CLIENT_PORT,
    proxy: {
      "/api": {
        target: `http://localhost:${SERVER_PORT}`,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
        ws: true,
      },
    },
  },
  define: {
    WS_URL:
      env.command === "build"
        ? process.env.SERVER_URL ?? '"blood-on-the-clocktower.onrender.com"'
        : TEST_MODE
          ? "''"
          : `\`\${window.location.hostname}:${CLIENT_PORT}/api\``,
  },
}));
