import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {
      NEXT_PUBLIC_SUPABASE_URL: JSON.stringify(process.env.NEXT_PUBLIC_SUPABASE_URL),
      NEXT_PUBLIC_SUPABASE_ANON_KEY: JSON.stringify(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    },
  },
});
