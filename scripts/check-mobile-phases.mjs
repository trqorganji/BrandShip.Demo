import assert from 'node:assert/strict';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.RESPONSIVE_BASE_URL || 'http://localhost:5173/';
const browser = await chromium.launch({ headless: true, ...(process.env.CHROME_EXECUTABLE ? { executablePath: process.env.CHROME_EXECUTABLE } : {}) });
try {
  for (const width of [320, 353, 390, 650]) {
    const page = await browser.newPage({ viewport: { width, height: 725 }, isMobile: true, hasTouch: true });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(new URL('services.html', base).href);
    await page.locator('.phone-phase-reveal').waitFor();
    await page.evaluate(() => document.fonts.ready);
    const cards = page.locator('.method-section .method-grid article');
    assert.equal(await cards.count(), 5);
    const before = await cards.first().evaluate(element => ({
      copy: getComputedStyle(element.querySelector('p')).opacity,
      node: getComputedStyle(element, '::after').opacity,
      track: getComputedStyle(element, '::before').transform,
    }));
    assert.equal(before.copy, '0');
    assert.equal(before.node, '0');
    assert.equal(before.track, 'matrix(1, 0, 0, 0, 0, 0)', 'Future timeline segments wait with their phase');
    const heights = await cards.evaluateAll(elements => elements.map(element => element.offsetHeight));
    for (let index = 0; index < 5; index++) {
      const card = cards.nth(index);
      await card.evaluate(element => scrollTo({ top: scrollY + element.getBoundingClientRect().top - 260, behavior: 'instant' }));
      await page.waitForFunction(index => document.querySelectorAll('.method-section .method-grid article')[index].classList.contains('milestone-arrived'), index);
      if (index === 0) {
        assert.equal(await card.locator('b').evaluate(element => getComputedStyle(element).animationName), 'phone-milestone-copy');
        assert.equal(await card.evaluate(element => getComputedStyle(element, '::before').animationName), 'phone-phase-track');
        assert.equal(await cards.nth(4).evaluate(element => getComputedStyle(element, '::after').opacity), '0');
      }
      await page.waitForFunction(index => document.querySelectorAll('.method-section .method-grid article')[index].classList.contains('milestone-settled'), index);
      assert((await card.locator(':scope>*').evaluateAll(elements => elements.map(element => getComputedStyle(element).opacity))).every(opacity => opacity === '1'), 'Phase label, heading, explanation and output all settle fully visible');
      assert.equal(await card.evaluate(element => getComputedStyle(element, '::before').transform), 'matrix(1, 0, 0, 1, 0, 0)');
      assert.equal(await card.evaluate(element => getComputedStyle(element, '::after').opacity), '1');
    }
    assert.deepEqual(await cards.evaluateAll(elements => elements.map(element => element.offsetHeight)), heights);
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.waitForFunction(() => !document.querySelector('.phone-phase-reveal'));
    assert((await cards.locator('p').evaluateAll(elements => elements.map(element => getComputedStyle(element).opacity))).every(opacity => opacity === '1'));
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    assert.equal(await page.locator('.phone-phase-reveal').count(), 0);
    assert.equal(await cards.first().locator('b').evaluate(element => getComputedStyle(element).animationName), 'none');
    assert.deepEqual(errors, []);
    await page.close();
    console.log(`${width}px: phase copy, growing rail, marker, stable layout, reduced motion and desktop passed`);
  }
  const fast = await browser.newPage({ viewport: { width: 353, height: 725 }, isMobile: true, hasTouch: true });
  await fast.goto(new URL('services.html', base).href);
  await fast.locator('.phone-phase-reveal').waitFor();
  await fast.locator('.method-section article').last().evaluate(element => scrollTo({ top: scrollY + element.getBoundingClientRect().top - 260, behavior: 'instant' }));
  await fast.waitForFunction(() => document.querySelector('.method-grid article:last-child').classList.contains('milestone-settled'), null, { timeout: 1800 });
  console.log('Fast scroll to the final phase passed');
} finally { await browser.close(); }
