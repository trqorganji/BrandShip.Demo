import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { validateCareersContent, careerApplicationHref } from '../src/careers-content.mjs';
import { careersAuthOrigin, createCareersCmsConfig } from '../src/careers-cms-config.mjs';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.RESPONSIVE_BASE_URL || 'http://localhost:5173/';
const role = { title: 'Example brand designer', team: 'Creative', location: 'Riyadh', type: 'Full-time', requirements: ['Build clear visual identity systems.', 'Share a portfolio of relevant work.'], open: true };
const content = { version: 1, jobs: [role, { ...role, title: '<img src=x onerror=alert(1)>', team: 'Strategy', location: 'Remote', type: 'Contract' }, { ...role, title: 'Closed example role', open: false }] };
assert.equal(validateCareersContent(content).length, 3);
for (const bad of [{ ...role, title: '' }, { ...role, title: 'x'.repeat(81) }, { ...role, title: 'Header\r\nInjection' }, { ...role, requirements: [] }, { ...role, requirements: Array(5).fill('Too many') }, { ...role, requirements: ['x'.repeat(141)] }, { ...role, type: 'Not allowed' }, { ...role, team: 'Not allowed' }, { ...role, open: 'true' }]) assert.throws(() => validateCareersContent({ version: 1, jobs: [bad] }));
assert.throws(() => validateCareersContent({ version: 1, jobs: Array(51).fill(role) }));
assert.deepEqual(JSON.parse(await readFile(new URL('../public/content/careers.json', import.meta.url))), { version: 1, jobs: [] });
for (const raw of ['', 'http://example.com', 'https://user:secret@example.com', 'https://example.com?token=bad', 'https://example.com/#bad', 'https://example.com/auth']) assert.equal(careersAuthOrigin(raw), null);
const config = createCareersCmsConfig({ authOrigin: 'https://cms-auth.example.test', siteUrl: base });
assert.equal(config.backend.repo, 'trqorganji/BrandShip.Demo');
assert.equal(config.backend.branch, 'main');
assert.equal(config.backend.auth_endpoint, 'auth');
assert.equal(config.load_config_file, false);
assert(!config.local_backend, 'Never enable an anonymous local backend in production');
const jobsField = config.collections[0].files[0].fields.find(field => field.name === 'jobs');
assert.equal(jobsField.allow_remove, true);
assert.equal(jobsField.fields.find(field => field.name === 'requirements').max, 4);
assert.equal(new URL(careerApplicationHref('Example role & location')).searchParams.get('subject'), 'Career application: Example role & location | Brandship');
const browser = await chromium.launch({ headless: true, ...(process.env.CHROME_EXECUTABLE ? { executablePath: process.env.CHROME_EXECUTABLE } : {}) });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
  const errors = [], requests = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => { requests.push(request.url()); assert.equal(request.method(), 'GET', 'Tests must not submit or publish anything'); });
  let mode = 'roles';
  await page.route('**/content/careers.json', route => route.fulfill({ status: mode === 'error' ? 503 : 200, contentType: 'application/json', body: mode === 'invalid' ? '{"version":1,"jobs":[{}]}' : JSON.stringify(mode === 'roles' ? content : { version: 1, jobs: [] }) }));
  async function visit() { await page.goto(new URL('careers.html', base).href); await page.locator('.job-board[data-jobs-state]').waitFor(); }
  await visit();
  assert.equal(await page.locator('.job-card').count(), 2);
  assert(!await page.locator('#job-board-list').textContent().then(text => text.includes('Closed example role')));
  assert.equal(await page.locator('#job-board-list img').count(), 0, 'CMS content must render as safe text');
  assert.equal(await page.locator('.job-card h3').last().textContent(), '<img src=x onerror=alert(1)>');
  const link = new URL(await page.locator('.job-apply').first().getAttribute('href'));
  assert.equal(link.pathname, 'labeeb@ourbrandship.com');
  assert.equal(link.searchParams.get('subject'), `Career application: ${role.title} | Brandship`);
  await page.locator('#job-board-team').selectOption('Creative');
  assert.equal(await page.locator('.job-card').count(), 1);
  await page.locator('#job-board-search').fill('nonexistent role');
  assert(await page.locator('#job-board-empty').isVisible());
  assert.match(await page.locator('#job-board-count').textContent(), /0 positions/);
  await page.locator('#job-board-search').fill('');
  await page.locator('#job-board-team').selectOption('');
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const selector of ['#positions', '#job-board-filters', '.job-card', '.job-general-application']) {
      await page.locator(selector).first().scrollIntoViewIfNeeded();
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `Job board overflows at ${width}px`);
    }
    assert((await page.locator('.job-apply').first().boundingBox()).height >= 44);
    if (width < 801) assert(parseFloat(await page.locator('#job-board-search').evaluate(e => getComputedStyle(e).fontSize)) >= 16);
  }
  assert(!requests.some(url => url.includes('decap-cms')), 'Public pages must never load the CMS');
  mode = 'empty';
  await visit();
  assert.equal(await page.locator('.job-card').count(), 0);
  assert.match(await page.locator('#job-board-empty-title').textContent(), /No open positions/);
  assert(await page.locator('#job-board-filters').isHidden());
  mode = 'error';
  await visit();
  assert.equal(await page.locator('.job-board').getAttribute('data-jobs-state'), 'error');
  assert.match(await page.locator('#job-board-count').textContent(), /unavailable/);
  mode = 'roles';
  await page.locator('#job-board-retry').click();
  await page.locator('.job-board[data-jobs-state="ready"]').waitFor();
  assert.equal(await page.locator('.job-card').count(), 2);
  mode = 'invalid';
  await visit();
  assert.equal(await page.locator('.job-board').getAttribute('data-jobs-state'), 'error');
  assert.equal(await page.locator('.job-card').count(), 0);
  await page.goto(new URL('admin/?auth=https://untrusted.example', base).href);
  await page.locator('body[data-cms-state]').waitFor();
  if (!process.env.CAREERS_CMS_CONNECTED_BUILD) {
    assert.equal(await page.locator('body').getAttribute('data-cms-state'), 'setup-required');
    assert(await page.locator('#hr-open-editor').isDisabled());
    assert.match(await page.locator('#hr-connection-status').textContent(), /not connected/);
    assert(!requests.some(url => url.includes('decap-cms')), 'No remote CMS or login request before configuration');
  }
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `Admin welcome overflows at ${width}px`);
  }
  assert.deepEqual(errors, []);
  console.log('CMS schema/auth guards, safe roles, filters, apply links, closed/empty/error/retry states, responsive public/admin layouts: passed');
} finally { await browser.close(); }
