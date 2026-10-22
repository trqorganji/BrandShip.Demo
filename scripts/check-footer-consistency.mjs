import assert from 'node:assert/strict';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.RESPONSIVE_BASE_URL || 'http://localhost:5173/';
const routes = ['index.html', 'about.html', 'services.html', 'work.html', 'insights.html', 'careers.html', 'contact.html', 'team.html', 'practice.html?area=branding', 'practice.html?area=communication', 'case-study.html?project=masar'];
const browser = await chromium.launch({ headless: true, ...(process.env.CHROME_EXECUTABLE ? { executablePath: process.env.CHROME_EXECUTABLE } : {}) });
try {
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    let reference;
    for (const route of routes) {
      await page.goto(new URL(route, base).href);
      await page.locator('body.brand-ink footer.refined-footer').waitFor();
      await page.evaluate(async () => {
        await document.fonts.ready;
        // Allow reduced-motion color transitions to settle after enhancement.
        await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      });
      const footer = page.locator('footer.refined-footer');
      assert.equal(await footer.locator('.footer-top .footer-iconic').textContent(), 'Iconic');
      assert.equal(await footer.locator('.footer-top p br').count(), 1);
      const styles = await footer.evaluate(element => {
        const signature = getComputedStyle(element.querySelector('.footer-top p'));
        const accent = getComputedStyle(element.querySelector('.footer-iconic'));
        const top = getComputedStyle(element.querySelector('.footer-top'));
        const surface = getComputedStyle(element);
        return { color: signature.color, size: signature.fontSize, weight: signature.fontWeight, family: signature.fontFamily, align: signature.textAlign, accentColor: accent.color, accentStyle: accent.fontStyle, display: top.display, gap: top.gap, background: surface.backgroundColor, padding: surface.padding };
      });
      assert.equal(styles.color, 'rgb(255, 255, 255)', `${route}: signature is white`);
      assert.equal(styles.accentColor, 'rgb(0, 163, 255)', `${route}: only Iconic uses Brandship blue`);
      assert.equal(styles.accentStyle, 'italic');
      if (!reference) reference = styles;
      assert.deepEqual(styles, reference, `${route}: footer matches Home at ${width}px`);
      assert(await footer.evaluate(element => element.scrollWidth <= element.clientWidth + 1), `${route}: footer overflow at ${width}px`);
    }
    console.log(`${width}px: Home and 10 internal-page footers match`);
  }
  assert.deepEqual(errors, []);
} finally { await browser.close(); }
