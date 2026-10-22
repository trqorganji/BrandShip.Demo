import assert from 'node:assert/strict';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.RESPONSIVE_BASE_URL || 'http://localhost:5173/';
const browser = await chromium.launch({ headless: true, ...(process.env.CHROME_EXECUTABLE ? { executablePath: process.env.CHROME_EXECUTABLE } : {}) });
try {
  for (const width of [320, 390, 768, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    for (const [route, count] of [['index.html', 3], ['services.html', 2]]) {
      await page.goto(new URL(route, base).href);
      await page.locator('body.brand-ink').waitFor();
      await page.evaluate(() => document.fonts.ready);
      const links = page.locator('[data-request-cta]');
      assert.equal(await links.count(), count, `${route}: form must be discoverable throughout the page`);
      for (let i = 0; i < count; i++) {
        const link = links.nth(i);
        assert.equal((await link.textContent()).trim(), 'Request a service');
        assert.equal(await link.evaluate(el => el.href), new URL('contact.html#service-request', base).href);
        assert.equal(await link.locator('svg[aria-hidden="true"] path').count(), 1, 'CTA arrows must be vector icons');
        await link.scrollIntoViewIfNeeded();
        assert(await link.isVisible());
        assert((await link.boundingBox()).height >= 44, 'CTA must be a usable touch target');
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `CTA overflow at ${width}px on ${route}`);
      }
      await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
      await links.first().click();
      await page.waitForURL(new URL('contact.html#service-request', base).href);
      await page.locator('[data-request-ready="true"]').waitFor();
      const box = await page.locator('#request-form-title').boundingBox();
      const nav = await page.locator('header.nav').boundingBox();
      assert(box.y >= nav.y + nav.height - 1, 'Form heading must not sit under the fixed navigation');
      assert(box.y < 900, 'CTA must land directly on the form');
      console.log(`${width}px ${route}: CTA labels, icons, base paths, layout and form landing checked`);
    }
    assert.deepEqual(errors, []);
    await page.close();
  }
} finally { await browser.close(); }
