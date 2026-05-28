import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],

  build: {
    // Raise the chunk size warning threshold (bundle is expected to be large with framer-motion)
    chunkSizeWarningLimit: 600,

    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('react-helmet-async')) return 'helmet';
          if (id.includes('framer-motion') || id.includes('/aos/')) return 'animation-vendor';
          if (id.includes('react-dom') || id.includes('react-router-dom')) return 'react-vendor';
        },
      },
    },
  },
})
