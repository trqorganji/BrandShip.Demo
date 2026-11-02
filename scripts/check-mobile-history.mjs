import assert from 'node:assert/strict';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.RESPONSIVE_BASE_URL || 'http://localhost:5173/';
const browser = await chromium.launch({ headless: true, ...(process.env.CHROME_EXECUTABLE ? { executablePath: process.env.CHROME_EXECUTABLE } : {}) });
try {
  for (const width of [320, 353, 390, 650]) {
    const page = await browser.newPage({ viewport: { width, height: 725 }, isMobile: true, hasTouch: true });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(new URL('about.html', base).href);
    await page.locator('.phone-history-reveal').waitFor();
    await page.evaluate(() => document.fonts.ready);
    const cards = page.locator('.about-history .story-timeline article');
    assert.equal(await cards.count(), 5);
    assert.equal(await page.locator('.about-history article.milestone-arrived').count(), 0);
    assert.equal(await cards.first().locator('p').evaluate(element => getComputedStyle(element).opacity), '0', 'Offscreen chapters wait for their turn');
    const layout = await cards.evaluateAll(elements => elements.map(element => element.offsetHeight));
    for (let i = 0; i < 5; i++) {
      const card = cards.nth(i);
      await card.evaluate(element => scrollTo({ top: scrollY + element.getBoundingClientRect().top - 280, behavior: 'instant' }));
      await page.waitForFunction(index => document.querySelectorAll('.about-history .story-timeline article')[index].classList.contains('milestone-arrived'), i);
      if (i === 0) {
        const motion = await card.locator('h3').evaluate(element => ({ name: getComputedStyle(element).animationName, duration: getComputedStyle(element).animationDuration }));
        assert.equal(motion.name, 'phone-milestone-copy');
        assert(parseFloat(motion.duration) >= .7, 'Milestones use a smooth reveal');
        assert.equal(await cards.nth(4).locator('p').evaluate(element => getComputedStyle(element).opacity), '0', 'Later milestones do not reveal with the first one');
      }
      await page.waitForFunction(index => document.querySelectorAll('.about-history .story-timeline article')[index].classList.contains('milestone-settled'), i);
      assert.equal(await card.locator('p').evaluate(element => getComputedStyle(element).opacity), '1');
    }
    assert.deepEqual(await cards.evaluateAll(elements => elements.map(element => element.offsetHeight)), layout, 'Animations do not shift the layout');
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.waitForFunction(() => !document.querySelector('.phone-history-reveal'));
    assert.equal(await page.locator('.phone-history-reveal').count(), 0);
    assert((await cards.locator('p').evaluateAll(elements => elements.map(element => getComputedStyle(element).opacity))).every(value => value === '1'));
    await page.reload();
    await page.locator('.about-history .story-timeline').waitFor();
    assert.equal(await page.locator('.phone-history-reveal').count(), 0, 'Reduced motion never hides timeline copy');
    assert((await cards.locator('p').evaluateAll(elements => elements.map(element => getComputedStyle(element).opacity))).every(value => value === '1'));
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.waitForFunction(() => !document.querySelector('.phone-history-reveal'));
    assert.equal(await page.locator('.phone-history-reveal').count(), 0, 'Desktop history remains unchanged');
    assert.equal(await cards.first().locator('h3').evaluate(element => getComputedStyle(element).animationName), 'none');
    assert.deepEqual(errors, []);
    await page.close();
    console.log(`${width}px: sequential phone milestones, settled copy, stable layout, reduced motion and desktop passed`);
  }
  const fast = await browser.newPage({ viewport: { width: 353, height: 725 }, isMobile: true, hasTouch: true });
  await fast.goto(new URL('about.html', base).href);
  await fast.locator('.phone-history-reveal').waitFor();
  await fast.evaluate(() => document.fonts.ready);
  await fast.locator('.about-history article').last().evaluate(element => scrollTo({ top: scrollY + element.getBoundingClientRect().top - 280, behavior: 'instant' }));
  await fast.waitForFunction(() => document.querySelector('.about-history article:last-child').classList.contains('milestone-settled'), null, { timeout: 1800 });
  assert.equal(await fast.locator('.about-history article').last().locator('p').evaluate(element => getComputedStyle(element).opacity), '1', 'Fast scrolling does not queue offscreen chapters before the visible one');
  await fast.setViewportSize({ width: 651, height: 725 });
  await fast.waitForFunction(() => !document.querySelector('.phone-history-reveal'));
  assert((await fast.locator('.about-history article>p').evaluateAll(elements => elements.map(element => getComputedStyle(element).opacity))).every(value => value === '1'), 'Every milestone is visible above the phone breakpoint');
  console.log('Fast scrolling and 650/651px breakpoint passed');
} finally { await browser.close(); }
