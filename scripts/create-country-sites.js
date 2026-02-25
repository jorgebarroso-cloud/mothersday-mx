/**
 * Create Mother's Day static site projects for each country under a base folder.
 * Run from repo root: node scripts/create-country-sites.js [--base=C:\Users\FEVER\Documents\MOTHERS DAY]
 * Copies template (excluding .git, node_modules, .cursor, UK city folders), writes
 * data/campaigns/mothers-day-<country>.json, and substitutes GA4 + domain in js/main.js, legal/cookies.html, index.html.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DEFAULT_BASE = path.join(process.env.USERPROFILE || 'C:\\Users\\FEVER', 'Documents', 'MOTHERS DAY');

const UK_DOMAIN = 'https://celebratemothersday.co.uk';
const UK_GA = 'G-L9EXZB0W73';
const UK_SITE_NAME = 'Celebrate Mother\'s Day';

const EXCLUDE_DIRS = new Set(['.git', 'node_modules', '.cursor', 'birmingham', 'brighton', 'bristol', 'edinburgh', 'leeds', 'liverpool', 'london', 'manchester']);

const COUNTRY_CONFIG = {
  ES: {
    domain: 'https://celebrardiadelamadre.es',
    gaId: 'G-15MJL5RBKM',
    locale: 'es',
    slug: 'mothers-day-es',
    feverPathTemplate: 'https://feverup.com/es/{city}/dia-de-la-madre',
    feverCandlelightPathTemplate: 'https://feverup.com/es/{city}/candlelight-{city}',
    outputDataFile: 'data/fever-plans-es.json',
    campaignName: 'Día de la Madre',
    countryLabel: 'España',
    siteName: 'Celebrar Día de la Madre',
    countdownType: 'none',
    cities: [{ slug: 'madrid', name: 'Madrid' }, { slug: 'barcelona', name: 'Barcelona' }],
    copy: {
      countdownMessage: '¡Quedan {days} días para el {campaignName}!',
      heroCta: 'Ver experiencias de {campaignName}',
      seeAllOnFever: 'Ver todo en Fever',
      breadcrumbHome: 'España',
      heroTitleHome: 'Celebra el Día de la Madre 2026 — Regalos, ideas y experiencias',
      heroTitleCity: 'Día de la Madre en {city} — Regalos e ideas',
      heroImageAltHome: 'Madre e hija tomando el té — regalo experiencia Día de la Madre',
      heroImageAltCity: 'Madre e hija — experiencia Día de la Madre en {city}',
      heroImageAltSubpage: 'Madre e hija — Día de la Madre {topic} en {city}'
    }
  },
  FR: {
    domain: 'https://celebrerfetedesmeres.fr',
    gaId: 'G-98BZR6SSFQ',
    locale: 'fr',
    slug: 'mothers-day-fr',
    feverPathTemplate: 'https://feverup.com/fr/{city}/fete-des-meres',
    feverCandlelightPathTemplate: 'https://feverup.com/fr/{city}/candlelight-{city}',
    outputDataFile: 'data/fever-plans-fr.json',
    campaignName: 'Fête des Mères',
    countryLabel: 'France',
    siteName: 'Célébrer Fête des Mères',
    countdownType: 'none',
    cities: [{ slug: 'paris', name: 'Paris' }, { slug: 'lyon', name: 'Lyon' }],
    copy: {
      countdownMessage: 'Plus que {days} jours avant la {campaignName} !',
      heroCta: 'Voir les expériences {campaignName}',
      seeAllOnFever: 'Voir tout sur Fever',
      breadcrumbHome: 'France',
      heroTitleHome: 'Fête des Mères 2026 — Cadeaux, idées et expériences',
      heroTitleCity: 'Fête des Mères à {city} — Cadeaux et idées',
      heroImageAltHome: 'Mère et fille au thé — expérience Fête des Mères',
      heroImageAltCity: 'Mère et fille — expérience Fête des Mères à {city}',
      heroImageAltSubpage: 'Mère et fille — Fête des Mères {topic} à {city}'
    }
  },
  DE: {
    domain: 'https://muttertagfeiern.de',
    gaId: 'G-QGDSKQWML5',
    locale: 'de',
    slug: 'mothers-day-de',
    feverPathTemplate: 'https://feverup.com/de/{city}/mutters-tag',
    feverCandlelightPathTemplate: 'https://feverup.com/de/{city}/candlelight-{city}',
    outputDataFile: 'data/fever-plans-de.json',
    campaignName: 'Muttertag',
    countryLabel: 'Deutschland',
    siteName: 'Muttertag feiern',
    countdownType: 'none',
    cities: [{ slug: 'berlin', name: 'Berlin' }, { slug: 'munich', name: 'München' }],
    copy: {
      countdownMessage: 'Noch {days} Tage bis zum {campaignName}!',
      heroCta: '{campaignName}-Erlebnisse entdecken',
      seeAllOnFever: 'Alles auf Fever anzeigen',
      breadcrumbHome: 'Deutschland',
      heroTitleHome: 'Muttertag 2026 — Geschenke, Ideen und Erlebnisse',
      heroTitleCity: 'Muttertag in {city} — Geschenke und Ideen',
      heroImageAltHome: 'Mutter und Tochter beim Tee — Muttertag Erlebnisgeschenk',
      heroImageAltCity: 'Mutter und Tochter — Muttertag Erlebnis in {city}',
      heroImageAltSubpage: 'Mutter und Tochter — Muttertag {topic} in {city}'
    }
  },
  IT: {
    domain: 'https://celebralamamma.it',
    gaId: 'G-NK95C34034',
    locale: 'it',
    slug: 'mothers-day-it',
    feverPathTemplate: 'https://feverup.com/it/{city}/festa-della-mamma',
    feverCandlelightPathTemplate: 'https://feverup.com/it/{city}/candlelight-{city}',
    outputDataFile: 'data/fever-plans-it.json',
    campaignName: 'Festa della Mamma',
    countryLabel: 'Italia',
    siteName: 'Celebra la Mamma',
    countdownType: 'none',
    cities: [{ slug: 'rome', name: 'Roma' }, { slug: 'milan', name: 'Milano' }],
    copy: {
      countdownMessage: 'Mancano {days} giorni alla {campaignName}!',
      heroCta: 'Scopri le esperienze per la {campaignName}',
      seeAllOnFever: 'Vedi tutto su Fever',
      breadcrumbHome: 'Italia',
      heroTitleHome: 'Festa della Mamma 2026 — Regali, idee ed esperienze',
      heroTitleCity: 'Festa della Mamma a {city} — Regali e idee',
      heroImageAltHome: 'Mamma e figlia a merenda — regalo esperienza Festa della Mamma',
      heroImageAltCity: 'Mamma e figlia — esperienza Festa della Mamma a {city}',
      heroImageAltSubpage: 'Mamma e figlia — Festa della Mamma {topic} a {city}'
    }
  },
  MX: {
    domain: 'https://celebrardiadelasmadres.mx',
    gaId: 'G-VSEHV8SSVZ',
    locale: 'es-MX',
    slug: 'mothers-day-mx',
    feverPathTemplate: 'https://feverup.com/mx/{city}/dia-de-las-madres',
    feverCandlelightPathTemplate: 'https://feverup.com/mx/{city}/candlelight-{city}',
    outputDataFile: 'data/fever-plans-mx.json',
    campaignName: 'Día de las Madres',
    countryLabel: 'México',
    siteName: 'Celebrar Día de las Madres',
    countdownType: 'none',
    cities: [{ slug: 'mexico-city', name: 'Ciudad de México' }, { slug: 'guadalajara', name: 'Guadalajara' }],
    copy: {
      countdownMessage: '¡Faltan {days} días para el Día de las Madres!',
      heroCta: 'Ver experiencias para el Día de las Madres',
      seeAllOnFever: 'Ver todo en Fever',
      breadcrumbHome: 'México',
      heroTitleHome: 'Día de las Madres 2026 — Regalos, ideas y experiencias',
      heroTitleCity: 'Día de las Madres en {city} — Regalos e ideas',
      heroImageAltHome: 'Mamá e hija tomando el té — regalo experiencia Día de las Madres',
      heroImageAltCity: 'Mamá e hija — experiencia Día de las Madres en {city}',
      heroImageAltSubpage: 'Mamá e hija — Día de las Madres {topic} en {city}'
    }
  },
  BR: {
    domain: 'https://celebrardiadasmaes.com.br',
    gaId: 'G-QK7TE7TEE7',
    locale: 'pt-BR',
    slug: 'mothers-day-br',
    feverPathTemplate: 'https://feverup.com/pt/{city}/dia-das-maes',
    feverCandlelightPathTemplate: 'https://feverup.com/pt/{city}/candlelight-{city}',
    outputDataFile: 'data/fever-plans-br.json',
    campaignName: 'Dia das Mães',
    countryLabel: 'Brasil',
    siteName: 'Celebrar Dia das Mães',
    countdownType: 'none',
    cities: [{ slug: 'sao-paulo', name: 'São Paulo' }, { slug: 'rio-de-janeiro', name: 'Rio de Janeiro' }],
    copy: {
      countdownMessage: 'Faltam {days} dias para o Dia das Mães!',
      heroCta: 'Ver experiências do Dia das Mães',
      seeAllOnFever: 'Ver tudo no Fever',
      breadcrumbHome: 'Brasil',
      heroTitleHome: 'Dia das Mães 2026 — Presentes, ideias e experiências',
      heroTitleCity: 'Dia das Mães em {city} — Presentes e ideias',
      heroImageAltHome: 'Mãe e filha no chá — presente experiência Dia das Mães',
      heroImageAltCity: 'Mãe e filha — experiência Dia das Mães em {city}',
      heroImageAltSubpage: 'Mãe e filha — Dia das Mães {topic} em {city}'
    }
  },
  CA: {
    domain: 'https://celebratemothersday.ca',
    gaId: 'G-SM59WTHZCP',
    locale: 'en-CA',
    slug: 'mothers-day-ca',
    feverPathTemplate: 'https://feverup.com/en/{city}/mothers-day',
    feverCandlelightPathTemplate: 'https://feverup.com/en/{city}/candlelight-{city}',
    outputDataFile: 'data/fever-plans-ca.json',
    campaignName: 'Mother\'s Day',
    countryLabel: 'Canada',
    siteName: 'Celebrate Mother\'s Day',
    countdownType: 'none',
    cities: [{ slug: 'toronto', name: 'Toronto' }, { slug: 'vancouver', name: 'Vancouver' }],
    copy: {
      countdownMessage: 'Hurry! {campaignName} is in {days} days.',
      heroCta: 'See {campaignName} experiences',
      seeAllOnFever: 'See all on Fever',
      breadcrumbHome: 'Canada',
      heroTitleHome: 'Mother\'s Day 2026 — Gifts, Ideas & Experiences',
      heroTitleCity: 'Mother\'s Day in {city} — Gifts & Experiences',
      heroImageAltHome: 'Mother and daughter having afternoon tea — Mother\'s Day experience gift',
      heroImageAltCity: 'Mother and daughter — Mother\'s Day experience in {city}',
      heroImageAltSubpage: 'Mother and daughter — Mother\'s Day {topic} in {city}'
    }
  },
  AU: {
    domain: 'https://celebratemothersday.com.au',
    gaId: 'G-HDYNV545PX',
    locale: 'en-AU',
    slug: 'mothers-day-au',
    feverPathTemplate: 'https://feverup.com/en/{city}/mothers-day',
    feverCandlelightPathTemplate: 'https://feverup.com/en/{city}/candlelight-{city}',
    outputDataFile: 'data/fever-plans-au.json',
    campaignName: 'Mother\'s Day',
    countryLabel: 'Australia',
    siteName: 'Celebrate Mother\'s Day',
    countdownType: 'none',
    cities: [{ slug: 'sydney', name: 'Sydney' }, { slug: 'melbourne', name: 'Melbourne' }],
    copy: {
      countdownMessage: 'Hurry! {campaignName} is in {days} days.',
      heroCta: 'See {campaignName} experiences',
      seeAllOnFever: 'See all on Fever',
      breadcrumbHome: 'Australia',
      heroTitleHome: 'Mother\'s Day 2026 — Gifts, Ideas & Experiences',
      heroTitleCity: 'Mother\'s Day in {city} — Gifts & Experiences',
      heroImageAltHome: 'Mother and daughter having afternoon tea — Mother\'s Day experience gift',
      heroImageAltCity: 'Mother and daughter — Mother\'s Day experience in {city}',
      heroImageAltSubpage: 'Mother and daughter — Mother\'s Day {topic} in {city}'
    }
  }
};

function parseArgs() {
  const base = process.argv.find(a => a.startsWith('--base='));
  const countriesArg = process.argv.find(a => a.startsWith('--countries='));
  let countries = Object.keys(COUNTRY_CONFIG);
  if (countriesArg) {
    const list = countriesArg.split('=')[1].split(',').map(c => c.trim().toUpperCase());
    countries = list.filter(c => COUNTRY_CONFIG[c]);
  }
  return { baseDir: base ? base.split('=')[1] : DEFAULT_BASE, countries };
}

function copyRecursive(src, dest, excludeDirs) {
  if (!fs.existsSync(src)) return;
  const stat = fs.statSync(src);
  if (stat.isFile()) {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
    return;
  }
  if (!stat.isDirectory()) return;
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const e of entries) {
    if (excludeDirs.has(e.name)) continue;
    const srcPath = path.join(src, e.name);
    const destPath = path.join(dest, e.name);
    if (e.isDirectory()) copyRecursive(srcPath, destPath, excludeDirs);
    else fs.copyFileSync(srcPath, destPath);
  }
}

function writeCampaignConfig(destDir, country, config) {
  const campaignsDir = path.join(destDir, 'data', 'campaigns');
  fs.mkdirSync(campaignsDir, { recursive: true });
  const slug = config.slug;
  const payload = {
    slug,
    locale: config.locale,
    domain: config.domain,
    feverBase: 'https://feverup.com',
    feverPathTemplate: config.feverPathTemplate,
    feverCandlelightPathTemplate: config.feverCandlelightPathTemplate,
    outputDataFile: config.outputDataFile,
    cities: config.cities,
    maxExperiencesPerCity: 24,
    maxGiftCardsPerCity: 12,
    campaignName: config.campaignName,
    countryLabel: config.countryLabel,
    siteName: config.siteName,
    countdownType: config.countdownType,
    copy: config.copy
  };
  const filePath = path.join(campaignsDir, `${slug}.json`);
  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2), 'utf8');
  console.log('  Wrote', path.relative(destDir, filePath));
}

function replaceInFile(filePath, replacements) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  for (const [from, to] of replacements) {
    content = content.split(from).join(to);
  }
  fs.writeFileSync(filePath, content, 'utf8');
}

function processCountry(baseDir, country, config) {
  const destDir = path.join(baseDir, country);
  console.log('\n---', country, config.domain, '---');
  fs.mkdirSync(destDir, { recursive: true });
  copyRecursive(ROOT, destDir, EXCLUDE_DIRS);
  writeCampaignConfig(destDir, country, config);

  const domain = config.domain;
  const gaId = config.gaId;
  const siteName = config.siteName;
  const domainHost = domain.replace(/^https:\/\//, '').replace(/\/$/, '');

  replaceInFile(path.join(destDir, 'js', 'main.js'), [
    [UK_GA, gaId]
  ]);
  replaceInFile(path.join(destDir, 'js', 'main.min.js'), [
    [UK_GA, gaId]
  ]);
  replaceInFile(path.join(destDir, 'legal', 'cookies.html'), [
    [UK_GA, gaId],
    [UK_DOMAIN, domain],
    ['celebratemothersday.co.uk', domainHost],
    [UK_SITE_NAME, siteName]
  ]);
  replaceInFile(path.join(destDir, 'index.html'), [
    [UK_GA, gaId],
    [UK_DOMAIN, domain],
    ['celebratemothersday.co.uk', domainHost],
    [UK_SITE_NAME, siteName]
  ]);
  replaceInFile(path.join(destDir, '404.html'), [
    [UK_DOMAIN, domain],
    ['celebratemothersday.co.uk', domainHost],
    [UK_SITE_NAME, siteName]
  ]);

  console.log('  Replaced GA4 and domain in js/main.js, legal/cookies.html, index.html, 404.html');
}

function main() {
  const { baseDir, countries } = parseArgs();
  console.log('Template root:', ROOT);
  console.log('Output base:', baseDir);
  console.log('Countries:', countries.join(', '));
  for (const country of countries) {
    processCountry(baseDir, country, COUNTRY_CONFIG[country]);
  }
  console.log('\nDone. Created/updated', countries.length, 'country folder(s).');
  console.log('Next: run "node scripts/generate-city-pages.js --campaign=<slug>" in each folder to generate city pages, or use scripts/open-cursor-workspaces.ps1 to open Cursor for each.');
}

main();
