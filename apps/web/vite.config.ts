import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  server: {
    port: 3001,
  },
  // Bun built-in modules (`bun:sqlite`, etc.) and node:* must be externalized;
  // Vite's bundler / Node's default ESM loader can't resolve `bun:` URLs.
  ssr: {
    external: ["bun:sqlite", "bun:test", "bun:ffi"],
    noExternal: [],
  },
  optimizeDeps: {
    exclude: ["bun:sqlite", "bun:test", "bun:ffi"],
  },
  plugins: [tsconfigPaths(), tanstackStart(), nitro({ preset: "bun" }), viteReact(), tailwindcss()],
});
