import './case-study-editorial.css';

const base = import.meta.env.BASE_URL;
const asset = file => `${base}${file.replace(/^\//, '')}`;
const escape = text => String(text).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const arrow = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg>';
const marks = {
  'king-salman-gate': 'client-original-king-salman-gate.png',
  'rua-al-haram': 'client-original-rua-al-haram.webp',
  'madina-made': 'client-madina-made.png',
  'riyadh-schools-group': 'client-original-riyadh-schools.svg',
  qiddiya: 'client-original-qiddiya.jpeg', eksab: 'client-original-eksab.jpg',
  masar: 'client-original-masar.jpeg', 'king-salman-park': 'client-original-king-salman-park.png',
  'jeddah-central': 'client-original-jeddah-central.png', 'invest-saudi': 'client-original-invest-saudi.webp'
};

// Editorial diagrams interpret the draft narrative; they are not client artwork.
const diagrams = {
  masar: ['flow', ['M20 50H260C390 50 360 180 500 180H980', 'M20 180H980', 'M20 310H260C390 310 360 180 500 180H980']],
  'king-salman-gate': ['arrival', ['M150 330V30H850V330', 'M260 330V90H740V330', 'M370 330V150H630V330', 'M500 330V195']],
  'rua-al-haram': ['movement', ['M40 290H230V225H410V160H590V95H770V30H960', 'M40 330H270V265H450V200H630V135H810V70H960']],
  'madina-made': ['belief', ['M240 330V190C240 20 760 20 760 190V330', 'M330 330V200C330 85 670 85 670 200V330', 'M420 330V210C420 155 580 155 580 210V330']],
  'riyadh-schools-group': ['potential', ['M120 300V60H880', 'M280 300V110H880', 'M440 300V160H880', 'M600 300V210H880']],
  qiddiya: ['play', ['M100 280 360 40 480 180 720 60 900 260', 'M160 320 400 100 520 240 760 120 960 320', 'M80 180 280 40']],
  eksab: ['opportunity', ['M160 310V230H280V310', 'M360 310V170H480V310', 'M560 310V100H680V310', 'M760 310V30H880V310']],
  'king-salman-park': ['life', ['M500 340V30', 'M500 250 270 110', 'M500 190 730 50', 'M500 310 180 190', 'M500 310 820 190']],
  'jeddah-central': ['coast', ['M20 100C160 10 300 190 440 100S720 10 980 100', 'M20 180C160 90 300 270 440 180S720 90 980 180', 'M20 260C160 170 300 350 440 260S720 170 980 260']],
  'invest-saudi': ['ambition', ['M180 310 500 30 820 310', 'M320 310 500 150 680 310', 'M500 310V30', 'M80 310H920']]
};

export function renderCaseStudy({ key, data, nextKey, next, index, total }) {
  const main = document.querySelector('#main');
  const [motif, paths] = diagrams[key];
  document.title = `${data.name} | Brandship`;
  document.querySelector('meta[name="description"]')?.setAttribute('content', `${data.name}: ${data.tagline}. Explore Brandship’s project story and scope of work.`);
  main.className = 'cs-project';
  main.dataset.project = key;
  main.innerHTML = `
    <section class="cs-hero" aria-labelledby="cs-project-title">
      <img class="cs-hero-image" src="${asset(data.image)}" alt="${escape(data.name)} project visual" fetchpriority="high" decoding="async">
      <div class="cs-hero-shade"></div>
      <div class="cs-hero-top"><a href="${base}work.html">All work <span aria-hidden="true">/</span></a><span>Case ${String(index).padStart(2, '0')} / ${String(total).padStart(2, '0')}</span></div>
      <div class="cs-hero-copy"><span class="cs-eyebrow">${escape(data.sector)}</span><h1 id="cs-project-title">${escape(data.name)}</h1><p>${escape(data.tagline)}</p></div>
      <a class="cs-hero-discover" href="#cs-brief">Discover the story <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v16m-7-7 7 7 7-7"/></svg></a>
    </section>
    <nav class="cs-chapter-nav" aria-label="Project chapters"><div><span class="cs-nav-project">${escape(data.name)}</span>${[['brief','01','The brief'],['idea','02','The idea'],['work','03','The work'],['scope','04','Scope & value']].map(([id, number, label]) => `<a href="#cs-${id}"><small>${number}</small>${label}</a>`).join('')}</div></nav>
    <section id="cs-brief" class="cs-brief cs-shell" aria-labelledby="cs-brief-title">
      <div class="cs-section-heading"><span class="cs-eyebrow">01 / The brief</span><p class="cs-review-tag">Editorial demo · project copy pending approval</p></div>
      <div class="cs-overview"><h2 id="cs-brief-title">${escape(data.statement)}<span class="cs-blue-stop">.</span></h2><p>${escape(data.summary)}</p></div>
      <dl class="cs-facts"><div><dt>Client / project</dt><dd>${escape(data.name)}</dd></div><div><dt>Sector</dt><dd>${escape(data.sector)}</dd></div><div><dt>Practice</dt><dd>${escape(data.scope.slice(0, 2).join(' · '))}</dd></div></dl>
      <div class="cs-challenge"><span class="cs-eyebrow">The challenge</span><h3>${escape(data.challenge)}</h3></div>
    </section>
    <section id="cs-idea" class="cs-concept" aria-labelledby="cs-idea-title" data-motif="${motif}">
      <div class="cs-shell"><div class="cs-section-heading"><span class="cs-eyebrow">02 / The defining idea</span><span class="cs-concept-caption">An editorial interpretation of the draft narrative</span></div>
      <div class="cs-concept-stage"><span class="cs-concept-watermark" aria-hidden="true">${escape(data.word)}</span><svg class="cs-concept-diagram" viewBox="0 0 1000 360" aria-hidden="true"><g class="cs-diagram-guides">${paths.map(d => `<path d="${d}"/>`).join('')}</g><g class="cs-diagram-draw">${paths.map((d, i) => `<path d="${d}" pathLength="1" style="--path-order:${i}"/>`).join('')}</g></svg><h2 id="cs-idea-title">${escape(data.word)}<span>.</span></h2></div>
      <div class="cs-strategy"><span class="cs-eyebrow">Brandship’s direction</span><p>${escape(data.response)}</p></div></div>
    </section>
    <section id="cs-work" class="cs-work cs-shell" aria-labelledby="cs-work-title">
      <div class="cs-section-heading"><span class="cs-eyebrow">03 / The work</span></div>
      <div class="cs-work-intro"><h2 id="cs-work-title">${escape(data.deliveryTitle)}</h2><p>${escape(data.delivery)}</p></div>
      <div class="cs-work-gallery"><figure class="cs-client-mark"><div><img src="${asset(`assets/${marks[key]}`)}" alt="${escape(data.name)} client mark" loading="lazy" decoding="async"></div><figcaption><span>Client mark</span><span>Existing supplied artwork</span></figcaption></figure><aside class="cs-artwork-note"><span class="cs-eyebrow">A closer look</span><h3>The detail behind<br>the direction<span class="cs-blue-stop">.</span></h3><p>This demo currently includes a project visual and client mark. Approved identity layouts, applications and supporting project photography are needed to complete the visual story.</p><span class="cs-assets-status">Additional project assets pending approval</span></aside></div>
    </section>
    <section id="cs-scope" class="cs-scope cs-shell" aria-labelledby="cs-scope-title"><div class="cs-section-heading"><span class="cs-eyebrow">04 / Scope & intended value</span><h2 id="cs-scope-title">What the work brings together<span class="cs-blue-stop">.</span></h2></div><div class="cs-scope-grid"><div><h3>Scope of work</h3><ol>${data.scope.map((item, i) => `<li><span>${String(i + 1).padStart(2, '0')}</span>${escape(item)}</li>`).join('')}</ol></div><div><h3>Intended strategic value</h3><ul>${data.outcomes.map(item => `<li>${escape(item)}</li>`).join('')}</ul><p class="cs-evidence-note">These are intended benefits described in the draft, not measured performance results. Project claims and supporting evidence require client approval.</p></div></div></section>
    <section class="cs-next cs-shell" aria-label="Next project"><div class="cs-next-top"><span class="cs-eyebrow">Continue exploring</span><a href="${base}work.html">View all work ${arrow}</a></div><a class="cs-next-link" href="${base}case-study.html?project=${nextKey}"><img src="${asset(next.image)}" alt="" loading="lazy" decoding="async"><div><span>Next case study / ${escape(next.sector)}</span><h2>${escape(next.name)}</h2></div>${arrow}</a></section>`;
  main.removeAttribute('aria-busy');
  enableCaseMotion(main);
}

function enableCaseMotion(main) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = matchMedia('(max-width:800px)');
  const hero = main.querySelector('.cs-hero');
  const concept = main.querySelector('.cs-concept');
  const active = new Set();
  let frame = 0;
  function paint() {
    frame = 0;
    active.forEach(section => {
      const box = section.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, (innerHeight * .85 - box.top) / Math.max(1, box.height * .75)));
      if (section === concept) {
        section.style.setProperty('--concept-progress', reduced.matches ? 1 : progress);
        section.style.setProperty('--concept-drift', `${reduced.matches || mobile.matches ? 0 : (progress - .5) * 60}px`);
      } else section.style.setProperty('--hero-depth', `${reduced.matches || mobile.matches ? 0 : Math.max(0, Math.min(70, -box.top * .16))}px`);
    });
  }
  const schedule = () => { if (!frame && !document.hidden) frame = requestAnimationFrame(paint); };
  const visibility = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) active.add(entry.target); else active.delete(entry.target); });
    schedule();
  }, { rootMargin: '100px' });
  [hero, concept].forEach(section => visibility.observe(section));
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule);
  reduced.addEventListener('change', schedule);
  document.addEventListener('visibilitychange', schedule);
  const reveals = new IntersectionObserver(entries => entries.forEach(({ target, isIntersecting }) => {
    if (!isIntersecting) return;
    if (!reduced.matches) {
      const animation = target.animate([{ opacity: .6, transform: 'translateY(16px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 600, easing: 'cubic-bezier(.2,.7,.2,1)' });
      const stop = () => { if (reduced.matches) animation.cancel(); };
      reduced.addEventListener('change', stop);
      animation.finished.catch(() => {}).finally(() => reduced.removeEventListener('change', stop));
    }
    reveals.unobserve(target);
  }), { threshold: .12 });
  main.querySelectorAll('.cs-overview,.cs-challenge,.cs-work-intro,.cs-client-mark,.cs-scope-grid').forEach(item => reveals.observe(item));
  const chapterLinks = [...main.querySelectorAll('.cs-chapter-nav a')];
  function markChapter(id) {
    chapterLinks.forEach(link => {
      if (link.hash === `#${id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  const chapters = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) markChapter(entry.target.id);
  }), { rootMargin: '-25% 0px -60% 0px' });
  main.querySelectorAll('section[id]').forEach(section => chapters.observe(section));
  chapterLinks.forEach(link => link.addEventListener('click', () => markChapter(link.hash.slice(1))));
  markChapter('cs-brief');
}
