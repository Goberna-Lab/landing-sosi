// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://goberna-lab.github.io',
  base: '/landing-sosi',
  vite: {
    plugins: [tailwindcss()]
  }
});