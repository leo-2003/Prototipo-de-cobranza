import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // This makes process.env.API_KEY available in the client-side code.
    // Vercel will set the process.env.API_KEY during the build process.
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  }
})
