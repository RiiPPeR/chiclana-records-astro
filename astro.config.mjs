// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/serverless';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  // or 'hybrid'
  output: 'server',
  integrations: [tailwind(), react()],
  adapter: vercel(),
});