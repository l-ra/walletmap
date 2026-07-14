import { getCollection } from 'astro:content';
import { seriesBasePath } from './scenarios';
import {
  getGlossary,
  getGlossaryIds,
  registerGlossaryUsage,
  type GlossaryUsageIndex,
} from './glossary-core';

export {
  getGlossary,
  getGlossaryEntry,
  getGlossaryIds,
  extractGlossaryIds,
  type Glossary,
  type GlossaryEntry,
  type GlossaryUsageIndex,
  type GlossaryUsageRef,
} from './glossary-core';

export async function buildGlossaryUsageIndex(): Promise<GlossaryUsageIndex> {
  const [articles, scenarios] = await Promise.all([
    getCollection('articles', ({ data }) => !data.draft),
    getCollection('scenarios', ({ data }) => !data.draft),
  ]);

  const usage: GlossaryUsageIndex = {};

  for (const article of articles) {
    registerGlossaryUsage(usage, article.body, article.data.title, `/clanky/${article.slug}`);
  }

  for (const scenario of scenarios) {
    registerGlossaryUsage(
      usage,
      scenario.body,
      scenario.data.title,
      `${seriesBasePath}/${scenario.slug}`,
    );
  }

  for (const refs of Object.values(usage)) {
    refs.sort((a, b) => a.title.localeCompare(b.title, 'cs'));
  }

  return usage;
}

export function getAllGlossaryTags(): string[] {
  const glossary = getGlossary();
  return [...new Set(getGlossaryIds().flatMap((id) => glossary[id].tags || []))].sort(
    (a, b) => a.localeCompare(b, 'cs'),
  );
}
