import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",                // Use JSDOM for simulating a browser environment
    globals: true,                        // Allows using `describe`, `it`, `expect` globally
    setupFiles: ["./src/test/setup.ts"],  // Run this setup file before tests
    include: ["src/**/*.{test,spec}.{ts,tsx}"], // Patterns for test files
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // '@' maps to 'src/' for easier imports
    },
  },
});