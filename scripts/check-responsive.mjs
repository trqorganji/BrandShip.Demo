// Run with PLAYWRIGHT_MODULE pointing to an installed Playwright index.mjs.
// Optionally set CHROME_EXECUTABLE and RESPONSIVE_BASE_URL.
import assert from 'node:assert/strict';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ headless: true, ...(process.env.CHROME_EXECUTABLE ? { executablePath: process.env.CHROME_EXECUTABLE } : {}) });
const routes = ['index.html', 'about.html', 'services.html', 'work.html', 'insights.html', 'careers.html', 'practice.html?area=branding', 'practice.html?area=communication', 'contact.html', 'team.html', 'case-study.html?project=king-salman-gate'];
const base = process.env.RESPONSIVE_BASE_URL || 'http://localhost:5173/';
let failures = 0;
try {
  for (const width of [320, 390, 768]) {
    const page = await browser.newPage({ viewport: { width, height: 844 }, isMobile: true, hasTouch: true });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    for (const route of routes) {
      errors.length = 0;
      await page.goto(new URL(route, base).href);
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(350);
      if (route === 'about.html') {
        assert.equal(await page.locator('.about-purpose-grid').evaluate(e => getComputedStyle(e).backgroundColor), 'rgba(0, 0, 0, 0)', 'Mission & Vision must retain the final layout in production');
      }
      for (const fraction of [0, .5, 1]) {
        await page.evaluate(f => scrollTo(0, (document.documentElement.scrollHeight - innerHeight) * f), fraction);
        await page.waitForTimeout(100);
        const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
        if (scrollWidth > width + 1) { console.error(`Overflow: ${route} at ${width}px, scroll ${fraction}: ${scrollWidth}px`); failures++; }
      }
      if (route === 'work.html') {
        await page.locator('.archive-mobile-sector select').selectOption('1');
        await page.locator('.archive-refine summary').click();
        assert(await page.locator('.archive-refine').evaluate(e => e.open));
        await page.locator('.archive-reset').click();
        assert.equal(await page.locator('.archive-mobile-sector select').inputValue(), '0');
      }
      await page.locator('.menu-btn').click();
      assert.equal(await page.locator('.menu').getAttribute('aria-hidden'), 'false');
      await page.locator('.menu-btn').click();
      if (errors.length) { console.error(route, errors); failures++; }
      console.log(`${width}px ${route}: checked`);
    }
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(new URL('careers.html', base).href);
    assert(await page.locator('.culture-cinema-simple').count());
    await page.close();
  }
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await desktop.goto(new URL('index.html', base).href);
  await desktop.locator('.project-deck').waitFor();
  const titles = await desktop.locator('.project-deck .home-project h3').allTextContents();
  for (const [index, fraction] of [.1, .5, .8].entries()) {
    await desktop.evaluate(f => {
      const section = document.querySelector('.home-selected');
      scrollTo(0, section.offsetTop + (section.offsetHeight - innerHeight + 110) * f - 110);
    }, fraction);
    await desktop.waitForTimeout(300);
    assert.equal((await desktop.locator('.project-deck [data-position="0"] h3').textContent()).trim(), titles[index].trim(), 'Production deck must advance with scroll');
  }
  await desktop.close();
  console.log('Desktop project deck scroll: checked');
} finally { await browser.close(); }
assert.equal(failures, 0, `${failures} responsive failures`);
