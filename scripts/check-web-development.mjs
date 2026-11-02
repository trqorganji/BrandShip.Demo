import assert from 'node:assert/strict';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.RESPONSIVE_BASE_URL || 'http://localhost:5173/';
const browser = await chromium.launch({ headless: true, ...(process.env.CHROME_EXECUTABLE ? { executablePath: process.env.CHROME_EXECUTABLE } : {}) });
try {
  for (const width of [320, 353, 390, 768, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce', isMobile: width < 801, hasTouch: width < 801 });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/*', route => route.request().method() === 'POST' ? route.abort() : route.continue());
    await page.goto(new URL('index.html', base).href);
    await page.locator('.home-web-service h3').waitFor();
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator('.home-service-groups>article').count(), 3);
    const start = page.locator('.home-web-service .home-link');
    assert.equal(await start.getAttribute('href'), new URL('services.html#web-development', base).pathname + '#web-development');
    await start.scrollIntoViewIfNeeded();
    assert((await start.boundingBox()).height >= 44);
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    assert.equal(await page.locator('.home-web-service .web-browser,.home-web-service [data-web-preview],.home-web-service .request-form-cta').count(), 0, 'Homepage service has no mock page or extra primary button');
    assert.deepEqual(await page.locator('.home-web-service').evaluate(element => [...element.children].map(child => child.tagName)), ['H3', 'P', 'UL', 'A'], 'Same content structure as the other services');
    await start.click();
    await page.waitForURL('**/services.html#web-development');
    await page.locator('.capability-domain#web-development a').click();
    await page.waitForURL('**/practice.html?area=web-development');
    await page.locator('.web-development-opening .web-browser').waitFor();
    assert.equal(await page.title(), 'Web Development | Brandship');
    assert.equal(await page.locator('.practice-capabilities article').count(), 4);
    assert.deepEqual(await page.locator('.branding-approach-track h3').allTextContents(), ['Discover', 'Design', 'Build', 'Launch']);
    assert.equal(await page.locator('#practice-root a[href*="case-study.html"]').count(), 0, 'Never attribute existing branding case studies to Web Development');
    for (const fraction of [0, .5, 1]) {
      await page.evaluate(fraction => scrollTo({ top: (document.documentElement.scrollHeight - innerHeight) * fraction, behavior: 'instant' }), fraction);
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `Web practice fits at ${width}px`);
    }
    await page.locator('.web-development-opening>.request-form-cta').click();
    await page.waitForURL('**/contact.html?service=web-development#service-request');
    await page.locator('[data-request-ready=true]').waitFor();
    assert(await page.locator('[name=services][value=web-development]').isChecked());
    assert.equal(await page.locator('#request-services-selection').textContent(), 'Web development');
    await page.locator('#request-name').fill('Web client');
    await page.locator('#request-email').fill('web@example.test');
    await page.locator('#request-message').fill('We need a new website.');
    await page.locator('[name=consent]').check();
    await page.locator('#request-review-button').click();
    await page.locator('#request-review').waitFor();
    assert.match(await page.locator('#request-summary').textContent(), /Web development/);
    await page.goto(new URL('services.html#web-development', base).href);
    await page.locator('.capability-domain#web-development').waitFor();
    assert.equal(await page.locator('.capability-domain').count(), 3);
    assert.equal(await page.locator('.capability-services details').count(), 11);
    assert.equal(await page.locator('.capability-domain#marcom details').count(), 7, 'Existing communication services stay in their own department');
    assert.match(await page.locator('.capability-intro').textContent(), /Three core domains/);
    assert.equal(await page.locator('.capability-domain#web-development a').getAttribute('href'), new URL('practice.html?area=web-development', base).pathname + '?area=web-development');
    assert.deepEqual(errors, []);
    await page.close();
    console.log(`${width}px: Home, dedicated practice, preselected enquiry/review and three service departments passed`);
  }
} finally { await browser.close(); }
