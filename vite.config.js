import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
/*export default defineConfig({
  plugins: [react()],
})*/
export default defineConfig({
  server: {
    host: true, // Esto debería permitir conexiones desde cualquier dirección IP,
    mimeTypes: {
      'application/javascript': ['js', 'jsx']
    }
  }
});

