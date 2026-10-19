// Read-only contrast sampling on flat surfaces; photographs/video need visual review.
import assert from 'node:assert/strict';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ headless: true, ...(process.env.CHROME_EXECUTABLE ? { executablePath: process.env.CHROME_EXECUTABLE } : {}) });
const base = process.env.RESPONSIVE_BASE_URL || 'http://localhost:5173/';
const routes = ['index.html', 'about.html', 'services.html', 'work.html', 'insights.html', 'careers.html', 'practice.html?area=branding', 'practice.html?area=communication', 'contact.html', 'team.html', 'case-study.html?project=masar'];
let warningCount = 0;
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
  for (const route of routes) {
    await page.goto(new URL(route, base).href);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(150);
    if (route === 'index.html' || route === 'work.html') {
      const surface = route === 'index.html' ? '.home-offering' : '.ink-filter-chapter';
      assert.equal(await page.locator(surface).evaluate(el => getComputedStyle(el).backgroundColor), 'rgb(9, 12, 16)', `${route}: section colours must share the dark canvas`);
    }
    const found = new Map();
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let top = 0; top < height; top += 850) {
      await page.evaluate(y => scrollTo({ top: y, behavior: 'instant' }), top);
      await page.waitForTimeout(70);
      const warnings = await page.evaluate(() => {
        const rgba = value => (value.match(/[\d.]+/g) || []).map(Number);
        const luminance = rgb => rgb.slice(0, 3).map(v => { v /= 255; return v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }).reduce((sum, v, i) => sum + v * [.2126, .7152, .0722][i], 0);
        return [...document.querySelectorAll('main h1,main h2,main h3,main h4,main p,main a,main button,main label,main summary,main span,main small,main dt,main dd,footer a')].flatMap(el => {
          const box = el.getBoundingClientRect(), style = getComputedStyle(el);
          if (!box.width || !box.height || box.top > innerHeight || box.bottom < 0 || style.visibility === 'hidden' || +style.opacity < .95 || el.disabled) return [];
          if (el.closest('.cs-hero,.hero,.cs-next-link,.work-opening-image,.editorial-media,.official-film,.cinematic-frame,.culture-film-scene,.culture-film-caption-layer,.home-project,.film-close,.insight-feature-dossier,.proof-image,[aria-hidden="true"]')) return [];
          const text = [...el.childNodes].filter(node => node.nodeType === 3).map(node => node.textContent).join('').trim();
          if (!text || text === '.' || !/[a-zA-Z]/.test(text)) return [];
          let parent = el, background;
          while (parent) {
            const computed = getComputedStyle(parent);
            if (computed.display === 'none' || computed.visibility === 'hidden' || +computed.opacity < .95) return [];
            const rgb = rgba(computed.backgroundColor);
            if (!background && (rgb.length === 3 || rgb[3] >= .95)) background = rgb;
            parent = parent.parentElement;
          }
          if (!background) return [];
          const foreground = rgba(style.color);
          if (foreground.length === 4 && foreground[3] < 1) foreground.splice(0, 3, ...foreground.slice(0, 3).map((v, i) => v * foreground[3] + background[i] * (1 - foreground[3])));
          const a = luminance(foreground), b = luminance(background);
          const ratio = (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
          const large = parseFloat(style.fontSize) >= 24 || (parseFloat(style.fontSize) >= 18.66 && parseInt(style.fontWeight) >= 700);
          if (ratio >= (large ? 3 : 4.5) - .05) return [];
          return [{ text: text.slice(0, 65), class: el.className, color: style.color, background: background.slice(0, 3), ratio: Math.round(ratio * 100) / 100 }];
        });
      });
      warnings.forEach(warning => found.set(`${warning.text}:${warning.color}:${warning.background}`, warning));
    }
    console.log(JSON.stringify({ route, warnings: [...found.values()] }));
    warningCount += found.size;
  }
} finally { await browser.close(); }
assert.equal(warningCount, 0, 'Flat-surface text contrast warnings need review');
