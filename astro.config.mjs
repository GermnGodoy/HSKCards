// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  output: 'server', // Enable SSR for API routes while keeping the rest of the site static
  adapter: vercel()
});