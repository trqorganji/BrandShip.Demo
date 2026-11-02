import assert from 'node:assert/strict';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.RESPONSIVE_BASE_URL || 'http://localhost:5173/';
const browser = await chromium.launch({ headless: true, ...(process.env.CHROME_EXECUTABLE ? { executablePath: process.env.CHROME_EXECUTABLE } : {}) });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(new URL('about.html', base).href);
  await page.locator('.story-continuation .connection-trace[d]').waitFor({ state: 'attached' });
  await page.evaluate(() => document.fonts.ready);
  for (const width of [320, 390, 650, 651, 768, 1440, 1996]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.locator('.connected-story').scrollIntoViewIfNeeded();
    await page.waitForTimeout(100);
    const state = await page.evaluate(() => {
      const pair = document.querySelector('.connected-story');
      const svg = pair.querySelector('.story-connection');
      const next = document.querySelector('.story-continuation');
      const tail = svg.querySelector('.connection-tail');
      const onward = next.querySelector('.connection-trace');
      const screenPoint = (path, atEnd) => {
        const point = path.getPointAtLength(atEnd ? path.getTotalLength() : 0);
        return new DOMPoint(point.x, point.y).matrixTransform(path.getScreenCTM());
      };
      const end = screenPoint(tail, true);
      const start = screenPoint(onward, false);
      const paragraphs = [...pair.querySelectorAll('p')].map(element => element.getBoundingClientRect());
      const collisions = [];
      [svg.querySelector('.connection-trace'), tail].forEach(path => {
        for (let i = 0; i <= 100; i++) {
          const point = path.getPointAtLength(path.getTotalLength() * i / 100);
          const p = new DOMPoint(point.x, point.y).matrixTransform(path.getScreenCTM());
          if (paragraphs.some(r => p.x > r.left + 2 && p.x < r.right - 2 && p.y > r.top + 2 && p.y < r.bottom - 2)) collisions.push([p.x, p.y]);
        }
      });
      return {
        stroke: parseFloat(getComputedStyle(tail).strokeWidth),
        opacity: +getComputedStyle(tail).opacity,
        radius: +svg.querySelector('.connection-node').getAttribute('r'),
        gap: Math.hypot(end.x - start.x, end.y - start.y),
        progress: pair.style.getPropertyValue('--connection-progress'),
        nextProgress: next.style.getPropertyValue('--connection-progress'),
        paths: [...document.querySelectorAll('.story-connection path')].map(path => path.getAttribute('d')),
        decorative: svg.getAttribute('aria-hidden') === 'true' && next.getAttribute('aria-hidden') === 'true',
        overflow: document.documentElement.scrollWidth > innerWidth + 1,
        collisions,
      };
    });
    assert(state.stroke >= 2.5 && state.opacity >= .8 && state.radius >= 5, 'Stronger line and larger markers');
    assert(state.gap < 3, `Line continues across the section boundary at ${width}px: ${state.gap}px gap`);
    assert.equal(+state.progress, 1, 'Reduced motion shows the complete story line');
    assert.equal(+state.nextProgress, 1, 'Reduced motion shows the continuation without animation');
    assert(state.paths.every(path => path && !/NaN|Infinity/.test(path)), 'All routes have finite geometry');
    assert.equal(state.decorative, true);
    assert.equal(state.overflow, false, `No horizontal overflow at ${width}px`);
    assert.deepEqual(state.collisions, [], `The connector must not cross paragraph text at ${width}px`);
    console.log(`${width}px: visible line, larger markers, joined sections, no text collisions or overflow`);
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  const place = async top => page.evaluate(top => {
    const pair = document.querySelector('.connected-story');
    scrollTo({ top: scrollY + pair.getBoundingClientRect().top - top, behavior: 'instant' });
  }, top);
  await place(950);
  await page.waitForFunction(() => +document.querySelector('.connected-story').style.getPropertyValue('--connection-progress') < .01);
  await place(180);
  await page.waitForTimeout(80);
  const early = await page.locator('.connected-story').evaluate(element => +element.style.getPropertyValue('--connection-progress'));
  await page.waitForTimeout(1200);
  const later = await page.locator('.connected-story').evaluate(element => +element.style.getPropertyValue('--connection-progress'));
  assert(early < .8 && later > early + .15, 'The reveal eases smoothly instead of jumping to complete');
  await place(-650);
  await page.waitForFunction(() => +document.querySelector('.story-continuation').style.getPropertyValue('--connection-progress') > .15, null, { timeout: 4500 });
  assert.equal(await page.locator('.story-continuation .connection-head').evaluate(element => getComputedStyle(element).opacity), '1', 'Moving marker carries into the film chapter');
  assert.equal(await page.locator('.about-history .story-timeline article').count(), 5, 'Existing History content remains unchanged');
  assert.deepEqual(errors, []);
  console.log('Smooth scroll reveal, timely handoff into the film chapter and reduced motion: passed');
} finally { await browser.close(); }
