import { cp, mkdir, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const source = fileURLToPath(new URL('../overview-presentation/', import.meta.url));
const target = fileURLToPath(new URL('../dist/overview-presentation/', import.meta.url));

// Publish only runtime files; preserve relative URLs and native JS modules.
const runtime = [
  'index.html', 'presenter.html',
  'styles.css', 'presenter.css',
  'app.js', 'presenter.js',
  'slides.mjs', 'enhance.mjs', 'interactive.mjs',
  'assets',
];

await rm(target, { recursive: true, force: true });
await mkdir(target, { recursive: true });
for (const entry of runtime) {
  await cp(join(source, entry), join(target, entry), { recursive: true });
}
console.log('Overview presentation copied to dist/overview-presentation/');
