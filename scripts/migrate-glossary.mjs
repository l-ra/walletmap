#!/usr/bin/env node
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const glossaryPath = join(root, 'src/data/glossary.json');
const contentDir = join(root, 'src/content');

const glossary = JSON.parse(readFileSync(glossaryPath, 'utf8'));
const keys = Object.keys(glossary).sort((a, b) => b.length - a.length);

function walk(dir) {
  const entries = [];
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) entries.push(...walk(path));
    else if (name.endsWith('.md')) entries.push(path);
  }
  return entries;
}

function migrateContent(text) {
  let result = text;

  for (const key of keys) {
    const entry = glossary[key];
    const abbr = entry.abbr;
    const escaped = abbr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    result = result.replace(
      new RegExp(`\\*\\*${escaped}\\*\\*\\s*\\([^)]*\\)`, 'g'),
      `[[${key}]]`,
    );
    result = result.replace(new RegExp(`\\*\\*${escaped}\\*\\*`, 'g'), `[[${key}]]`);
  }

  return result;
}

for (const file of walk(contentDir)) {
  const original = readFileSync(file, 'utf8');
  const migrated = migrateContent(original);
  if (migrated !== original) {
    writeFileSync(file, migrated, 'utf8');
    console.log(`migrated: ${file}`);
  }
}

console.log('Done.');
