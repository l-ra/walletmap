import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://walletmap.eu',
  trailingSlash: 'never',
  build: {
    format: 'directory',
  },
});
