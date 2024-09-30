import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from "vite-plugin-pwa";
// https://vitejs.dev/config/
/*export default defineConfig({
  plugins: [react()],
})*/
const manifestForPlugin = {
  registerType: "autoUpdate",
  includeAssets: [
    "favicon-196.ico",
    "apple-icon-180.png",
    "manifest-icon-192.maskable.png",
    "manifest-icon-512.maskable.png",
  ],
  manifest: {
    name: "UTHH Virtual",
    short_name: "UTHH Virtual",
    description: "Una plataforma de evaluacion educativa",
    icons:[
      {
          "src":"manifest-icon-192.maskable.png",
          "sizes":"192x192",
          "type":"image/png",
          "purpose":"any"
      },
      {
          "src":"manifest-icon-192.maskable.png",
          "sizes":"192x192",
          "type":"image/png",
          "purpose":"maskable"
      },
      {
          "src":"manifest-icon-512.maskable.png",
          "sizes":"512x512",
          "type":"image/png",
          "purpose":"any"
      },
      {
          "src":"manifest-icon-512.maskable.png",
          "sizes":"512x512",
          "type":"image/png",
          "purpose":"maskable"
      }
    ],
    theme_color: "#171717",
    background_color: "#e8ebf2",
    display: "standalone",
    scope: "/",
    start_url: "/",
    orientation: "portrait",
  },
};

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      manifest: manifestForPlugin,
      workbox: {
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // 10 MB
      },
    }),
  ],
  server: {
    host: true, // Esto debería permitir conexiones desde cualquier dirección IP,
    mimeTypes: {
      'application/javascript': ['js', 'jsx']
    }
  },
  optimizeDeps: {
    exclude: ['xlsx-style']
  }
});

