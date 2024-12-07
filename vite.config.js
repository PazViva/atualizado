import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Gratidão Diária',
        short_name: 'Gratidão',
        description: 'Seu diário pessoal de gratidão',
        theme_color: '#8B4513',
        icons: [
          {
            src: '/gratitude-icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/gratitude-icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/gratitude-icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ],
        background_color: '#F5F5DC',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        orientation: 'portrait'
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: new RegExp('^https://firestore.googleapis.com/'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              networkTimeoutSeconds: 5,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 24 * 60 * 60 // 24 hours
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      },
      devOptions: {
        enabled: true
      }
    })
  ]
});