// Exercise real phone journeys, not only viewport overflow.
import assert from 'node:assert/strict';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ headless: true, ...(process.env.CHROME_EXECUTABLE ? { executablePath: process.env.CHROME_EXECUTABLE } : {}) });
const base = process.env.RESPONSIVE_BASE_URL || 'http://localhost:5173/';
const errors = [];
try {
  for (const [width, height] of [[320, 740], [390, 844], [430, 932], [768, 1024], [844, 390]]) {
    const page = await browser.newPage({ viewport: { width, height }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(new URL('index.html', base).href);
    await page.evaluate(() => document.fonts.ready);
    await page.locator('.project-deck').waitFor();
    assert(await page.locator('.menu').evaluate(element => element.inert), 'Closed navigation is not keyboard reachable');
    const header = await page.locator('.nav').evaluate(nav => {
      const selectors = ['.brand', '.menu-btn', ...(innerWidth <= 800 ? ['.contact-pill'] : [])];
      return selectors.map(selector => {
        const element = nav.querySelector(selector);
        const rect = element.getBoundingClientRect();
        return { selector, x: rect.x, right: rect.right, height: rect.height, width: rect.width };
      });
    });
    header.forEach(item => {
      assert(item.height >= 44, `${width}px ${item.selector} is a comfortable touch target`);
      assert(item.x >= 0 && item.right <= width, `${width}px header control fits the viewport`);
    });
    const [brand, toggle, cta] = header;
    if (cta) assert(brand.right <= cta.x && cta.right <= toggle.x, `${width}px header controls never overlap`);
    await page.evaluate(() => scrollTo({ top: 600, behavior: 'instant' }));
    const originalScroll = await page.evaluate(() => scrollY);
    await page.locator('.menu-btn').click();
    assert.equal(await page.locator('.menu').getAttribute('aria-modal'), 'true');
    assert(await page.locator('main').evaluate(element => element.inert));
    assert.equal(await page.evaluate(() => document.body.style.position), 'fixed');
    await page.waitForFunction(() => document.querySelector('.menu').contains(document.activeElement));
    await page.locator('.menu-email').focus();
    await page.keyboard.press('Tab');
    assert.equal(await page.evaluate(() => document.activeElement.classList.contains('menu-btn')), true, 'Tab wraps within the navigation controls');
    await page.keyboard.press('Escape');
    assert(await page.locator('.menu').evaluate(element => element.inert));
    assert.equal(await page.evaluate(() => document.activeElement.classList.contains('menu-btn')), true);
    assert(Math.abs(await page.evaluate(() => scrollY) - originalScroll) < 2, 'Closing restores the reading position');
    await page.locator('.menu-btn').click();
    await page.locator('.menu-project-link').click();
    await page.waitForURL('**/contact.html');
    await page.locator('[data-request-ready=true]').waitFor();
    await page.evaluate(async () => {
      await document.fonts.ready;
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    });
    // Never deliver an enquiry if deployment configuration changes.
    await page.route('**/*', route => route.request().method() === 'POST' ? route.abort() : route.continue());
    if (width <= 800) {
      assert(await page.locator('.request-mobile-contact').count());
      await page.waitForFunction(limit => document.querySelector('.service-request-form').getBoundingClientRect().top < limit, width === 320 ? 420 : 400, { timeout: 5000 });
      const position = await page.evaluate(() => ({
        form: document.querySelector('.service-request-form').getBoundingClientRect().top,
        direct: document.querySelector('.request-mobile-contact').getBoundingClientRect().top,
        name: parseFloat(getComputedStyle(document.querySelector('#request-name')).fontSize),
      }));
      assert(position.form < (width === 320 ? 420 : 400), `Clients reach the form quickly at ${width}px: ${position.form}px`);
      assert(position.direct > position.form, 'Direct contact remains available after the form');
      assert(position.name >= 16, 'Phone inputs avoid browser focus zoom');
    }
    await page.locator('#request-name').fill('Mobile test');
    await page.locator('#request-email').fill('mobile@example.test');
    await page.locator('#request-service-picker>summary').click();
    await page.locator('[name=services][value=other]').check();
    await page.locator('#request-other-description').fill('A new brand experience');
    await page.locator('#request-proposals').setInputFiles({ name: 'brief.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.7\nMobile test') });
    await page.locator('[name=consent]').check();
    await page.locator('#request-review-button').click();
    await page.locator('#request-review').waitFor();
    assert.match(await page.locator('#request-summary').textContent(), /Mobile test/);
    await page.locator('#request-edit').click();
    assert.equal(await page.locator('#request-name').inputValue(), 'Mobile test', 'Review preserves form answers');
    assert.equal(await page.locator('#request-file-list li').count(), 1, 'Review preserves the proposal');
    await page.goto(new URL('about.html', base).href);
    await page.locator('.about-section-nav a[href="#team"]').waitFor();
    if (width <= 800 && height > 500) {
      await page.locator('.about-section-nav a[href="#team"]').click();
      await page.waitForTimeout(150);
      const chapter = await page.evaluate(() => ({
        top: document.querySelector('#team').getBoundingClientRect().top,
        rail: document.querySelector('.about-section-nav').getBoundingClientRect().bottom,
        height: document.querySelector('.about-section-nav').getBoundingClientRect().height,
      }));
      assert(chapter.height <= 60, 'About chapter navigation stays a compact single row');
      assert(chapter.top >= chapter.rail - 1, 'Chapter navigation does not cover the destination');
    }
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'No document overflow');
    await page.close();
    console.log(`${width} × ${height}: header, menu focus/scroll, enquiry, uploads and chapter navigation passed`);
  }
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(new URL('index.html', base).href);
  await page.locator('.home-work-scene').scrollIntoViewIfNeeded();
  await page.locator('.project-deck').scrollIntoViewIfNeeded();
  const first = await page.locator('.project-deck [data-position="0"] h3').textContent();
  const deck = await page.locator('.project-deck').boundingBox();
  const client = await page.context().newCDPSession(page);
  const point = { x: Math.round(deck.x + deck.width * .7), y: Math.round(deck.y + deck.height * .45) };
  await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [point] });
  for (let i = 1; i <= 6; i++) await client.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: point.x - i * 20, y: point.y + 1 }] });
  await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await page.waitForFunction(title => document.querySelector('.project-deck [data-position="0"] h3').textContent !== title, first);
  assert(new URL(page.url()).pathname.endsWith('/index.html'), 'A touch swipe changes the project without opening a case study');
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.locator('.search-toggle').click();
  await page.locator('#site-search-input').fill('services');
  assert.equal(await page.locator('.search-results a').count(), 1);
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('.site-search').getAttribute('aria-hidden'), 'true');
  assert.equal(await page.evaluate(() => document.body.style.position), '');
  await page.goto(new URL('contact.html', base).href);
  assert(await page.locator('.request-intro .enquiry-direct').count(), 'Desktop enquiry layout is preserved');
  assert.deepEqual(errors, [], 'No client-side exceptions');
  console.log('Touch project swipe, desktop search and desktop enquiry layout passed');
} finally { await browser.close(); }
