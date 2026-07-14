#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const glossary = JSON.parse(readFileSync(join(root, 'src/data/glossary.json'), 'utf8'));

for (const id of Object.keys(glossary).sort((a, b) => a.localeCompare(b, 'cs'))) {
  const entry = glossary[id];
  console.log(`${id}\t${entry.abbr}\t${entry.fullName.cs}`);
}
