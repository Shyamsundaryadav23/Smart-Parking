import { defineConfig } from "vite"; // Main Vite config helper
import react from "@vitejs/plugin-react-swc"; // React plugin with SWC compiler for faster builds
import path from "path"; // Node path module for resolving paths
import { componentTagger } from "lovable-tagger"; // Optional dev-only plugin for tagging components

export default defineConfig(({ mode }) => ({
  server: {
    host: "::", // Listen on all IPv6 addresses (also covers IPv4)
    port: 8080, // Dev server port
    proxy: {
      '/auth': 'http://localhost:5000',
      '/parking-lots': 'http://localhost:5000',
      '/reservations': 'http://localhost:5000',
      '/admin': 'http://localhost:5000',
    },
    hmr: {
      overlay: false, // Disable the error overlay in the browser
    },
  },
  plugins: [
    react(), // Always include React plugin
    mode === "development" && componentTagger() // Only run lovable-tagger in dev mode
  ].filter(Boolean), // Filter out false (for production build)
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // Use @ as shortcut to /src folder
    },
  },
}));