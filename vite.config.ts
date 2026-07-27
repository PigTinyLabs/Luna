import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// Custom plugin to remove crossorigin attributes for Capacitor iOS
const removeCrossoriginPlugin = () => {
  return {
    name: 'remove-crossorigin',
    transformIndexHtml(html: string) {
      return html.replace(/ crossorigin/g, '');
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: process.env.CAPACITOR === 'true' ? './' : '/Luna/',
  build: {
    target: 'es2015',
  },
  plugins: [
    react(), 
    removeCrossoriginPlugin(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      manifest: {
        name: 'Luna',
        short_name: 'Luna',
        description: 'Luna Tracker App',
        theme_color: '#f5f6fa',
        background_color: '#f5f6fa',
        display: 'standalone',
        icons: [
          {
            src: 'icons.svg',
            sizes: '192x192 512x512',
            type: 'image/svg+xml'
          }
        ]
      }
    })
  ],
})
