import { defineConfig } from 'astro/config';
import rehypeMermaid from 'rehype-mermaid';
import remarkGlossary from './src/plugins/remark-glossary.ts';

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
    remarkPlugins: [remarkGlossary],
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
