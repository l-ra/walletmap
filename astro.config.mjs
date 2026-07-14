import { defineConfig } from 'astro/config';
import rehypeMermaid from 'rehype-mermaid';

export default defineConfig({
  site: 'https://walletmap.eu',
  trailingSlash: 'never',
  build: {
    format: 'directory',
  },
  markdown: {
    syntaxHighlight: {
      type: 'shiki',
      excludeLangs: ['mermaid'],
    },
    rehypePlugins: [
      [
        rehypeMermaid,
        {
          strategy: 'img-svg',
          dark: true,
        },
      ],
    ],
  },
});
