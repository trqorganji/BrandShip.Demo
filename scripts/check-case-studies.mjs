// Same optional Playwright/Chrome environment variables as check-responsive.mjs.
import assert from 'node:assert/strict';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ headless: true, ...(process.env.CHROME_EXECUTABLE ? { executablePath: process.env.CHROME_EXECUTABLE } : {}) });
const base = process.env.RESPONSIVE_BASE_URL || 'http://localhost:5173/';
const keys = ['king-salman-gate', 'rua-al-haram', 'madina-made', 'riyadh-schools-group', 'qiddiya', 'eksab', 'masar', 'king-salman-park', 'jeddah-central', 'invest-saudi'];
try {
  for (const width of [320, 390, 768, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, isMobile: width < 801, hasTouch: width < 801 });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
    for (const [index, key] of keys.entries()) {
      errors.length = 0;
      await page.goto(new URL(`case-study.html?project=${key}`, base).href);
      await page.locator('.cs-hero h1').waitFor();
      await page.evaluate(() => document.fonts.ready);
      assert.equal(await page.locator('#main').getAttribute('data-project'), key);
      assert.equal(await page.locator('main h1').count(), 1);
      assert.equal(await page.locator('.cs-chapter-nav a').count(), 4);
      assert.equal(await page.locator('.case-impact-sample,.case-bridge,.story-grid').count(), 0);
      const next = new URL(await page.locator('.cs-next-link').getAttribute('href'), base);
      assert.equal(next.searchParams.get('project'), keys[(index + 1) % keys.length]);
      for (const selector of ['.cs-hero', '#cs-brief', '#cs-idea', '#cs-work', '#cs-scope', '.cs-next']) {
        await page.locator(selector).scrollIntoViewIfNeeded();
        assert((await page.evaluate(() => document.documentElement.scrollWidth)) <= width + 1, `${key} overflows at ${width}px in ${selector}`);
      }
      assert(await page.locator('.cs-client-mark img').evaluate(img => img.complete && img.naturalWidth > 0), `${key}: client mark must load`);
      assert.deepEqual(errors, [], `${key}: no runtime or asset errors`);
      console.log(`${width}px ${key}: passed`);
    }
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(new URL('case-study.html?project=masar', base).href);
    await page.locator('.cs-chapter-nav a[href="#cs-idea"]').click();
    await page.waitForTimeout(150);
    assert.equal(await page.locator('.cs-chapter-nav a[aria-current]').getAttribute('href'), '#cs-idea');
    assert.equal(await page.locator('.cs-diagram-draw path').first().evaluate(path => getComputedStyle(path).strokeDashoffset), '0px');
    assert.equal(await page.locator('.cs-hero-image').evaluate(img => getComputedStyle(img).animationName), 'none');
    await page.close();
  }
  const fallback = await browser.newPage();
  await fallback.goto(new URL('case-study.html?project=not-a-project', base).href);
  assert.equal(await fallback.locator('#main').getAttribute('data-project'), keys[0]);
  await fallback.close();
  console.log('All project templates, next links, responsive layouts and reduced-motion checks passed.');
} finally { await browser.close(); }
