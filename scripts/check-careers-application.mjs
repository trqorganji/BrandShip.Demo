import assert from 'node:assert/strict';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.RESPONSIVE_BASE_URL || 'http://localhost:5173/';
const browser = await chromium.launch({ headless: true, ...(process.env.CHROME_EXECUTABLE ? { executablePath: process.env.CHROME_EXECUTABLE } : {}) });
try {
  for (const width of [320, 390, 768, 1440]) {
    for (const reducedMotion of ['reduce', 'no-preference']) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(new URL('careers.html', base).href);
      await page.locator('.job-board.ink-dark[data-jobs-state="ready"]').waitFor();
      await page.evaluate(() => document.fonts.ready);
      assert.equal(await page.locator('.life-story-cover,.life-people-preview,.life-brand-interlude,#directors-word').count(), 0, 'Director/culture drafts must not remain in Careers');
      const apply = page.locator('.career-apply-button');
      assert(await apply.isVisible());
      assert((await apply.boundingBox()).height >= 44, 'Application CTA must be touch-friendly');
      for (const selector of ['.career-apply-button', '.career-role', '.consultancy-close>a']) {
        const destination = new URL(await page.locator(selector).getAttribute('href'));
        assert.equal(destination.protocol, 'mailto:');
        assert.equal(destination.pathname, 'labeeb@ourbrandship.com');
        assert.match(destination.searchParams.get('subject'), /career application/i);
      }
      assert(await page.locator('#job-board-empty').isVisible());
      assert.equal(await page.locator('.job-card').count(), 0, 'Do not invent real vacancies');
      assert(await page.evaluate(() => {
        const application = document.querySelector('#positions');
        const culture = document.querySelector('.career-culture');
        const linkedin = document.querySelector('.career-connect');
        return Boolean(application.compareDocumentPosition(culture) & Node.DOCUMENT_POSITION_FOLLOWING) && Boolean(culture.compareDocumentPosition(linkedin) & Node.DOCUMENT_POSITION_FOLLOWING);
      }), 'Applications must precede culture and LinkedIn');
      await page.locator('.careers-opening-link').click();
      await page.waitForFunction(() => document.activeElement?.id === 'positions');
      assert.equal(new URL(page.url()).hash, '#positions');
      // Check the complete applicant path and keep supporting photo motion available.
      for (const selector of ['#positions', '.career-role', '.career-culture', '.career-connect', '.consultancy-close']) {
        await page.locator(selector).scrollIntoViewIfNeeded();
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${width}px Careers overflow`);
      }
      if (width <= 800 || reducedMotion === 'reduce') assert(await page.locator('.culture-cinema-simple').count());
      await page.goto(new URL('about.html', base).href);
      await page.locator('#directors-word').waitFor();
      await page.locator('.about-section-nav a[href="#directors-word"]').click();
      assert.equal(new URL(page.url()).hash, '#directors-word');
      assert(await page.locator('#directors-word .director-quote-mark').isVisible());
      assert.equal(await page.locator('#directors-word').evaluate(el => Boolean(el.closest('.people-copy'))), true, 'Quote underneath the active team profile');
      assert.match(await page.locator('#directors-word').textContent(), /Approved messages/);
      assert.equal(await page.locator('#directors-word blockquote').count(), 0, 'Do not attribute an invented director quote');
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${width}px About overflow`);
      assert.deepEqual(errors, []);
      console.log(`${width}px / ${reducedMotion}: About director area, recruitment links, order and responsive motion passed`);
      await page.close();
    }
  }
} finally { await browser.close(); }
