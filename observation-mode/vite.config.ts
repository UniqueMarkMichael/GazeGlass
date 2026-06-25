import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/index.ts",
      name: "GazeGlassObservationMode",
      fileName: (format: string) => `observation-mode.${format === "es" ? "js" : "umd.cjs"}`,
      formats: ["es", "umd"],
    },
    cssCodeSplit: false,
    sourcemap: true,
  },
  test: {
    environment: "jsdom",
    include: ["test/**/*.test.ts"],
  },
});
