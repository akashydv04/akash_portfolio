import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import obfuscator from "vite-plugin-javascript-obfuscator";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    obfuscator({
      include: [/\.(js|jsx|ts|tsx)$/],
      exclude: [/node_modules/],
      options: {
        compact: true,
        controlFlowFlattening: true,
        controlFlowFlatteningThreshold: 0.75,
        deadCodeInjection: true,
        deadCodeInjectionThreshold: 0.4,
        debugProtection: true,
        debugProtectionInterval: 2000,
        disableConsoleOutput: true,
        identifierNamesGenerator: "hexadecimal",
        log: false,
        numbersToExpressions: true,
        renameGlobals: false, // Set to false for React to avoid breaking component names in some cases
        selfDefending: true,
        splitStrings: true,
        splitStringsChunkLength: 3,
        stringArray: true,
        stringArrayCallsTransform: true,
        stringArrayEncoding: ["base64", "rc4"],
        stringArrayThreshold: 0.75,
        unicodeEscapeSequence: false,
      },
    }),
  ],
  build: {
    sourcemap: false, // Critical: Disable sourcemaps to prevent reverse engineering
    // Increase chunk size warning limit to reduce noisy warnings for large UI bundles.
    // Keep this conservative (1MB) so real oversized chunks still warn.
    chunkSizeWarningLimit: 1000,
    minify: "terser", // Use Terser for better minification
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
});
