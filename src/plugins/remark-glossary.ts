import type { Root } from 'mdast';
import type { Plugin } from 'unified';
import { findAndReplace } from 'mdast-util-find-and-replace';
import {
  escapeHtml,
  getGlossaryEntry,
  GLOSSARY_PATTERN,
  nextGlossaryTipId,
  resetGlossaryTipCounter,
} from '../lib/glossary-core';

function buildGlossaryHtml(termId: string, display: string, fullName: string): string {
  const tipId = nextGlossaryTipId(termId);
  return [
    '<span class="glossary-term-wrap">',
    `<abbr class="glossary-abbr" data-glossary-id="${escapeHtml(termId)}" tabindex="0" aria-describedby="${tipId}" title="${escapeHtml(fullName)}">`,
    escapeHtml(display),
    '</abbr>',
    `<span id="${tipId}" class="glossary-tooltip" role="tooltip">`,
    `<span class="glossary-tooltip__full">${escapeHtml(fullName)}</span>`,
    `<button type="button" class="glossary-tooltip__more" data-glossary-open="${escapeHtml(termId)}">Více informací</button>`,
    '</span>',
    '</span>',
  ].join('');
}

export const remarkGlossary: Plugin<[], Root> = () => {
  return (tree, file) => {
    resetGlossaryTipCounter();

    findAndReplace(tree, [
      [
        GLOSSARY_PATTERN,
        (_match, id: string, displayOverride: string | undefined) => {
          const termId = id.trim();
          const entry = getGlossaryEntry(termId);

          if (!entry) {
            const filePath = file.path || file.history?.[0] || 'neznámý soubor';
            throw new Error(
              `Neznámá zkratka [[${termId}]] ve slovníku — soubor: ${filePath}`,
            );
          }

          const display = displayOverride?.trim() || entry.abbr;
          const fullName = entry.fullName.cs;

          return {
            type: 'html',
            value: buildGlossaryHtml(termId, display, fullName),
          };
        },
      ],
    ]);
  };
};

export default remarkGlossary;
