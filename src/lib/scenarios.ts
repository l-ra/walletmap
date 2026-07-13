export const SCENARIO_SERIES = 'strelecky-klub' as const;

export const categoryLabels: Record<string, string> = {
  uvod: 'Úvod',
  system: 'Nastavení systému',
  clenstvi: 'Členství',
  aplikace: 'Klubová aplikace',
  zavodnik: 'Závodník a soutěže',
  pristup: 'Přístup na střelnici',
  overovani: 'Státní doklady',
};

export const seriesBasePath = `/scenare/${SCENARIO_SERIES}`;
