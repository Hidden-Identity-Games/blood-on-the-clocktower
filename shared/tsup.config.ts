import { defineConfig } from "tsup";

export default defineConfig({
  name: "tsup",
  target: "node16",
  entry: ["./src/index.ts"],
  format: "esm",
  outExtension: () => ({ js: ".js", dts: ".dts" }),
  onSuccess: "tsc --emitDeclarationOnly --declaration",
  outDir: "dist",
  clean: true,
});
