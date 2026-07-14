import glossaryData from '../data/glossary.json';

export interface GlossarySource {
  label: string;
  url: string;
}

export interface GlossaryEntry {
  abbr: string;
  fullName: { cs: string; en?: string };
  shortDescription: string;
  longDescription?: string;
  aliases?: string[];
  tags?: string[];
  related?: string[];
  sources?: GlossarySource[];
}

export type Glossary = Record<string, GlossaryEntry>;

export interface GlossaryUsageRef {
  title: string;
  url: string;
}

export type GlossaryUsageIndex = Record<string, GlossaryUsageRef[]>;

const glossary = glossaryData as Glossary;

let termCounter = 0;

export function getGlossary(): Glossary {
  return glossary;
}

export function getGlossaryEntry(id: string): GlossaryEntry | undefined {
  return glossary[id];
}

export function getGlossaryIds(): string[] {
  return Object.keys(glossary).sort((a, b) =>
    glossary[a].abbr.localeCompare(glossary[b].abbr, 'cs'),
  );
}

export function nextGlossaryTipId(termId: string): string {
  termCounter += 1;
  return `glossary-tip-${termId}-${termCounter}`;
}

export function resetGlossaryTipCounter(): void {
  termCounter = 0;
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export const GLOSSARY_PATTERN = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;

export function extractGlossaryIds(text: string): string[] {
  const ids: string[] = [];
  let match: RegExpExecArray | null;
  const re = new RegExp(GLOSSARY_PATTERN.source, 'g');
  while ((match = re.exec(text)) !== null) {
    ids.push(match[1].trim());
  }
  return ids;
}

export function registerGlossaryUsage(
  usage: GlossaryUsageIndex,
  body: string,
  title: string,
  url: string,
): void {
  const seenOnPage = new Set<string>();

  for (const id of extractGlossaryIds(body)) {
    if (seenOnPage.has(id)) continue;
    seenOnPage.add(id);

    if (!usage[id]) usage[id] = [];
    if (!usage[id].some((ref) => ref.url === url)) {
      usage[id].push({ title, url });
    }
  }
}
