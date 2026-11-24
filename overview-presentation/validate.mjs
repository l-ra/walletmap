import { slides, deckMeta } from './slides.mjs';

const errors = [];
const ids = new Set();
let part = 1;

for (const [index, slide] of slides.entries()) {
  const prefix = `Slide ${index + 1}`;
  for (const field of ['id', 'title', 'section', 'html', 'notes', 'level', 'minutes', 'part']) {
    if (slide[field] === undefined || slide[field] === '') errors.push(`${prefix}: chybí ${field}`);
  }
  if (ids.has(slide.id)) errors.push(`${prefix}: duplicitní id ${slide.id}`);
  ids.add(slide.id);
  if (!['core', 'detail'].includes(slide.level)) errors.push(`${prefix}: neplatná úroveň ${slide.level}`);
  if (!Number.isInteger(slide.minutes) || slide.minutes < 1 || slide.minutes > 8) errors.push(`${prefix}: neplatný čas ${slide.minutes}`);
  if (slide.part < part) errors.push(`${prefix}: pořadí bloků se vrací zpět`);
  part = slide.part;
  if (!slide.notes.includes('<p>')) errors.push(`${prefix}: poznámky nemají odstavce`);
  for (const source of slide.sources ?? []) {
    if (!source.label || !source.url?.startsWith('https://')) errors.push(`${prefix}: neplatný zdroj`);
  }
}

const allMinutes = slides.reduce((sum, slide) => sum + slide.minutes, 0);
const coreMinutes = slides.filter((slide) => slide.level === 'core').reduce((sum, slide) => sum + slide.minutes, 0);
const part1 = slides.filter((slide) => slide.part === 1).reduce((sum, slide) => sum + slide.minutes, 0);
const part2 = slides.filter((slide) => slide.part === 2).reduce((sum, slide) => sum + slide.minutes, 0);

if (slides.length < 40) errors.push('Deck je příliš krátký pro požadovaný rozsah.');
if (allMinutes < 135 || allMinutes > 180) errors.push(`Plná varianta má ${allMinutes} min, očekáváno 135–180.`);
if (coreMinutes >= allMinutes) errors.push('Režim jádra nic nevynechává.');

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(JSON.stringify({ title: deckMeta.shortTitle, slides: slides.length, allMinutes, coreMinutes, part1, part2 }, null, 2));
