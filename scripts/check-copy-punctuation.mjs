import assert from 'node:assert/strict';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.RESPONSIVE_BASE_URL || 'http://localhost:5173/';
const projects = ['king-salman-gate', 'rua-al-haram', 'madina-made', 'riyadh-schools-group', 'qiddiya', 'eksab', 'masar', 'king-salman-park', 'jeddah-central', 'invest-saudi'];
const routes = ['index.html', 'about.html', 'services.html', 'work.html', 'insights.html', 'careers.html', 'team.html', 'contact.html', 'practice.html?area=branding', 'practice.html?area=communication', ...projects.map(key => `case-study.html?project=${key}`)];
const browser = await chromium.launch({ headless: true, ...(process.env.CHROME_EXECUTABLE ? { executablePath: process.env.CHROME_EXECUTABLE } : {}) });
try {
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const route of routes) {
    await page.goto(new URL(route, base).href);
    await page.locator('body.brand-ink').waitFor();
    const matches = await page.evaluate(() => {
      const unwanted = /[\u2013\u2014]|--/;
      const found = [];
      // Check hidden disclosure content too, not CSS variables, comments or script syntax.
      const walker = document.createTreeWalker(document.documentElement, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        const node = walker.currentNode;
        if (node.parentElement?.closest('script,style,noscript')) continue;
        if (unwanted.test(node.textContent)) found.push(node.textContent.trim());
      }
      document.querySelectorAll('[alt],[aria-label],[placeholder],meta[name="description"]').forEach(element => {
        for (const attribute of ['alt', 'aria-label', 'placeholder', 'content']) {
          const value = element.getAttribute(attribute);
          if (value && unwanted.test(value)) found.push(`${attribute}: ${value}`);
        }
      });
      return found;
    });
    assert.deepEqual(matches, [], `${route}: long or double dashes remain in site copy`);
    console.log(`${route}: copy checked`);
  }
  assert.deepEqual(errors, [], 'No page runtime errors');
  console.log('All page copy, titles, accessible labels and 10 case studies passed.');
} finally { await browser.close(); }
