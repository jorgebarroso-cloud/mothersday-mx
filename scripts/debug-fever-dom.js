/**
 * Debug: guarda HTML y estructura DOM alrededor de los enlaces /m/ en la landing Mother's Day
 * Uso: node scripts/debug-fever-dom.js
 */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const url = 'https://feverup.com/en/london/mothers-day';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 3000));
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await new Promise((r) => setTimeout(r, 2000));
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise((r) => setTimeout(r, 1000));

  const debug = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('a[href*="/m/"]')).filter(
      (a) => a.href && !a.href.includes('mothers-day') && a.closest('section')
    );
    const samples = [];
    for (let i = 0; i < Math.min(3, links.length); i++) {
      const a = links[i];
      const card = a.closest('article') || a.closest('[class*="card"]') || a.closest('li') || a.parentElement;
      let html = '';
      let imgInfo = null;
      if (card) {
        html = card.outerHTML.slice(0, 2500);
        const img = a.querySelector('img') || card.querySelector('img');
        if (img) {
          const attrs = {};
          for (const x of img.attributes) attrs[x.name] = x.value.length > 200 ? x.value.slice(0, 200) + '...' : x.value;
          imgInfo = { tag: img.tagName, attrs };
        } else {
          const picture = a.querySelector('picture') || card.querySelector('picture');
          if (picture) {
            const source = picture.querySelector('source');
            imgInfo = { from: 'picture', sourceSrcset: source ? (source.getAttribute('srcset') || source.getAttribute('data-srcset') || '').slice(0, 150) : null };
          }
        }
      }
      samples.push({ name: (a.textContent || '').trim().slice(0, 60), href: a.getAttribute('href'), cardTag: card ? card.tagName : null, imgInfo, htmlSlice: html ? html.slice(0, 800) : '' });
    }
    return { totalLinks: links.length, samples };
  });

  const out = path.join(__dirname, '..', 'data', 'debug-fever-dom.json');
  fs.writeFileSync(out, JSON.stringify(debug, null, 2), 'utf8');
  console.log('Debug escrito en', out);
  console.log('Total enlaces /m/:', debug.totalLinks);
  debug.samples.forEach((s, i) => {
    console.log('\n--- Muestra', i + 1, ':', s.name);
    console.log('card tag:', s.cardTag, 'imgInfo:', s.imgInfo ? JSON.stringify(s.imgInfo) : 'sin img');
  });
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
