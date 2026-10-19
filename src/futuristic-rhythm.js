import './futuristic-rhythm.css';
import './editorial-art-direction.css';

// Keep the homepage's established rhythm; carry it into key editorial moments.
export function enhanceFuturisticRhythm() {
  if (document.body.classList.contains('home-page')) return;
  const opening = document.querySelector('.work-catalogue-title');
  if (opening && !opening.classList.contains('work-portfolio-opening')) {
    opening.classList.add('work-portfolio-opening');
    const copy = document.createElement('div');
    copy.className = 'work-opening-copy';
    const label = document.createElement('span');
    label.className = 'work-opening-label';
    label.textContent = 'Brandship / Selected work';
    copy.append(label);
    while (opening.firstChild) copy.append(opening.firstChild);
    const mosaic = document.createElement('div');
    mosaic.className = 'work-opening-mosaic';
    [...document.querySelectorAll('.archive-card')].slice(0, 3).forEach((card, index) => {
      const link = document.createElement('a');
      link.href = card.href;
      const image = card.querySelector('img').cloneNode(true);
      image.loading = 'eager';
      image.decoding = 'async';
      const caption = document.createElement('span');
      caption.textContent = card.querySelector('h3')?.textContent || image.alt;
      link.append(image, caption);
      link.className = `work-opening-image image-${index + 1}`;
      mosaic.append(link);
    });
    opening.append(copy, mosaic);
  }
  document.querySelector('.insight-entry-featured')?.classList.add('insight-feature-dossier');
  document.querySelectorAll('.insight-entry-copy a').forEach(link => {
    if (link.querySelector('svg')) return;
    link.classList.add('editorial-link-arrow');
    const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    arrow.setAttribute('viewBox', '0 0 24 24');
    arrow.setAttribute('aria-hidden', 'true');
    arrow.innerHTML = '<path d="M5 19 19 5M5 5h14v14"/>';
    link.append(arrow);
  });
  const selectors = '.about-purpose,.client-stories,.capability-studio,.practice-capabilities,.culture-cinema-intro,.team-directory,.insight-feature-dossier,.work-portfolio-opening';
  const bands = [...document.querySelectorAll(selectors)].filter(band => !band.classList.contains('future-dark'));
  // Related sections are divs, so select the first one explicitly.
  const cases = document.querySelector('.practice-related');
  if (cases && !cases.classList.contains('future-dark') && !bands.includes(cases)) bands.push(cases);
  if (!bands.length) return;
  bands.forEach(band => {
    band.classList.add('future-dark');
    if (band.matches('.practice-capabilities')) {
      band.querySelectorAll('.branding-capability-mark path').forEach(path => path.setAttribute('pathLength', '1'));
    }
    // A converging route diagram belongs to connected services only. Careers
    // uses editorial typography; practice pages use their individual icons.
    if (!band.matches('.capability-studio')) return;
    const signal = document.createElement('div');
    signal.className = 'service-route-map';
    signal.setAttribute('aria-hidden', 'true');
    signal.innerHTML = '<svg viewBox="0 0 1000 150"><g class="route-guides"><path d="M40 30H270L400 75H960"/><path d="M40 75H960"/><path d="M40 120H270L400 75H960"/></g><g class="route-draw"><path pathLength="1" d="M40 30H270L400 75H960"/><path pathLength="1" d="M40 75H960"/><path pathLength="1" d="M40 120H270L400 75H960"/></g><rect x="391" y="66" width="18" height="18"/></svg>';
    band.prepend(signal);
  });
  const reduced = matchMedia('(prefers-reduced-motion:reduce)');
  const mobile = matchMedia('(max-width:800px)');
  let frame = 0;
  const active = new Set();
  function paint() {
    frame = 0;
    active.forEach(band => {
      const box = band.getBoundingClientRect();
      const progress = reduced.matches ? 1 : Math.max(0, Math.min(1, (innerHeight - box.top) / (innerHeight + box.height)));
      band.style.setProperty('--signal-progress', progress);
      band.style.setProperty('--editorial-depth', `${reduced.matches || mobile.matches ? 0 : (progress - .5) * 60}px`);
    });
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(paint); }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting) { active.add(target); target.classList.add('future-entered'); }
      else active.delete(target);
    });
    schedule();
  }, { rootMargin: '80px' });
  bands.forEach(band => observer.observe(band));
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule, { passive: true });
  reduced.addEventListener('change', schedule);
}
requestAnimationFrame(enhanceFuturisticRhythm);
