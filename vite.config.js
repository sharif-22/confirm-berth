import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import react from "@vitejs/plugin-react";

const manifestForPlugin = {
  registerType: "prompt",
  includeAssets: ["favicon.ico", "apple-touch-icon.png", "favicon.svg"],
  manifest: {
    name: "Confirm Berth",
    short_name: "Confirm Berth",
    description: "Simple app to check the pnr status of your next coming trips",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "apple touch icon",
      },
      {
        src: "/maskable_icon.png",
        sizes: "225x225",
        type: "image/png",
        purpose: "any maskable",
      },
    ],
    theme_color: "#059669",
    background_color: "#fafafa",
    display: "standalone",
    scope: "/",
    start_url: "/",
    orientation: "portrait",
  },
};

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  base: "/",
  plugins: [react(), VitePWA(manifestForPlugin)],

  // strip console/debugger from production builds only, so dev logs still work
  esbuild: command === "build" ? { drop: ["console", "debugger"] } : {},
}));
