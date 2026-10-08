import './cinematic-motion.css';

const base = import.meta.env.BASE_URL;
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const compact = matchMedia('(max-width: 800px)');
const clamp = value => Math.min(1, Math.max(0, value));
const ease = value => value * value * (3 - 2 * value);

// Preserve the homepage composition; the editorial routes share this motion system.
if (!document.body.classList.contains('home-page')) {
  document.body.classList.add('motion-luxury');
  const aboutPair = document.querySelector('.about-story-pair');
  if (aboutPair) {
    const stage = document.createElement('section');
    stage.className = 'cinematic-stage';
    stage.setAttribute('aria-label', 'BrandShip journey');
    stage.innerHTML = `<div class="cinematic-sticky">
      <div class="cinematic-orbit" aria-hidden="true"></div>
      <div class="cinematic-coordinate" aria-hidden="true"><span>Purpose / Perspective</span><span>BrandShip</span></div>
      <div class="cinematic-frame">
        <video muted loop playsinline preload="none" poster="${base}assets/official-brand-montage.jpg" aria-label="BrandShip brand work montage"></video>
        <div class="cinematic-shade" aria-hidden="true"></div>
        <div class="cinematic-caption"><span>Our journey</span><h2><span class="cinematic-title-line">Ideas become</span><span class="cinematic-title-line"><em>lasting impact.</em></span></h2><p>From a clear purpose to the work that moves brands forward.</p></div>
      </div>
      <div class="cinematic-cross cinematic-cross-one" aria-hidden="true"></div><div class="cinematic-cross cinematic-cross-two" aria-hidden="true"></div>
      <div class="cinematic-scroll" aria-hidden="true"><span>Scroll to unfold</span><i></i><span>The journey continues</span></div>
      <div class="cinematic-exit" aria-hidden="true"><span>Every chapter builds<br>what comes <em>next.</em></span></div>
    </div>`;
    aboutPair.after(stage);
    const video = stage.querySelector('video');
    video.muted = true;
    let inView = false;
    const syncFilm = () => {
      if (reduced.matches || document.hidden || !inView) { video.pause(); return; }
      if (!video.getAttribute('src')) video.src = `${base}assets/official-brand-montage.mp4`;
      video.play().catch(() => {});
    };
    const filmObserver = new IntersectionObserver(entries => {
      inView = entries[0].isIntersecting;
      syncFilm();
    }, { threshold: 0 });
    filmObserver.observe(stage);
    reduced.addEventListener('change', syncFilm);
    document.addEventListener('visibilitychange', syncFilm);
  }

  const method = document.querySelector('.method-section');
  if (method) {
    method.classList.add('motion-method');
    const sticky = document.createElement('div');
    sticky.className = 'motion-method-stage';
    while (method.firstChild) sticky.append(method.firstChild);
    method.append(sticky);
  }

  // Word masks preserve real headings, emphasis, spaces and native line wrapping.
  const headings = document.querySelectorAll('.about-editorial-copy h1,.feedback-heading h2,.practice-hero h1,.team-hero h1,.services-catalogue-title h1,.work-catalogue-title h1,.insights-catalogue-title h1,.careers-catalogue-title h1,.enquiry-layout h1,.consultancy-close h2');
  headings.forEach(heading => {
    heading.classList.add('motion-heading');
    const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    let index = 0;
    nodes.forEach(node => {
      const fragment = document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach(word => {
        if (!word || /^\s+$/.test(word)) { fragment.append(document.createTextNode(word)); return; }
        const mask = document.createElement('span');
        mask.className = 'motion-word';
        const text = document.createElement('span');
        text.textContent = word;
        text.style.setProperty('--word-delay', `${Math.min(index++ * 32, 240)}ms`);
        mask.append(text);
        fragment.append(mask);
      });
      node.replaceWith(fragment);
    });
  });

  const media = document.querySelectorAll('.editorial-media,.leadership-portrait,.team-grid img,.official-film,.practice-overview-grid>a,.team-preview article,.wider-team-grid article');
  media.forEach(item => item.classList.add('motion-surface'));
  const observer = new IntersectionObserver(entries => {
    entries.forEach(({ target, isIntersecting }) => {
      if (!isIntersecting) return;
      if (!reduced.matches) target.classList.add('motion-arrived');
      observer.unobserve(target);
    });
  }, { threshold: .14 });
  [...headings, ...media].forEach(item => observer.observe(item));

  const stage = document.querySelector('.cinematic-stage');
  const methodGrid = method?.querySelector('.method-grid');
  const phaseCards = [...(methodGrid?.querySelectorAll('article') || [])];
  const timeline = document.querySelector('.story-timeline');
  const workCards = [...document.querySelectorAll('.archive-card')];
  let animationFrame = 0;
  let lastTime = 0;
  let needsMeasure = true;
  let stageTarget = 0;
  let stageValue = 0;
  let processTarget = 0;
  let processValue = 0;

  function measure() {
    const staticView = reduced.matches || compact.matches;
    if (stage) {
      const rect = stage.getBoundingClientRect();
      stageTarget = staticView ? .76 : clamp(-rect.top / Math.max(1, rect.height - innerHeight));
    }
    if (method) {
      const rect = method.getBoundingClientRect();
      processTarget = staticView ? 1 : clamp((110 - rect.top) / Math.max(1, rect.height - innerHeight + 110));
    }
    if (timeline) {
      const rect = timeline.getBoundingClientRect();
      timeline.style.setProperty('--journey-progress', String(staticView ? 1 : clamp((innerHeight * .88 - rect.top) / (innerHeight * .65))));
    }
    workCards.forEach(card => {
      if (card.classList.contains('hidden')) return;
      const rect = card.getBoundingClientRect();
      if (rect.top > innerHeight * 1.2 || rect.bottom < -150) return;
      const progress = staticView ? 1 : clamp((innerHeight - rect.top) / (innerHeight + rect.height));
      card.style.setProperty('--card-progress', progress.toFixed(3));
    });
    if (staticView) { stageValue = stageTarget; processValue = processTarget; }
    needsMeasure = false;
  }

  function render(now) {
    animationFrame = 0;
    if (document.hidden) return;
    if (needsMeasure) measure();
    const elapsed = lastTime ? Math.min(64, now - lastTime) : 16;
    lastTime = now;
    const smoothing = 1 - Math.exp(-elapsed / 85);
    stageValue += (stageTarget - stageValue) * smoothing;
    processValue += (processTarget - processValue) * smoothing;
    if (stage) {
      const opening = ease(clamp(stageValue / .66));
      stage.style.setProperty('--portal-inset-x', `${(1 - opening) * 29}%`);
      stage.style.setProperty('--portal-inset-y', `${(1 - opening) * 23}%`);
      stage.style.setProperty('--portal-radius', `${(1 - opening) * 18}px`);
      stage.style.setProperty('--portal-scale', String(1.14 - opening * .14));
      stage.style.setProperty('--portal-progress', stageValue.toFixed(4));
      stage.style.setProperty('--portal-copy', String(ease(clamp((stageValue - .3) / .35))));
      stage.style.setProperty('--portal-exit', String(ease(clamp((stageValue - .82) / .18))));
      stage.style.setProperty('--portal-line', String(opening));
    }
    if (methodGrid) {
      methodGrid.style.setProperty('--process-progress', processValue.toFixed(4));
      phaseCards.forEach((card, index) => {
        const focus = reduced.matches || compact.matches ? 1 : clamp(1 - Math.abs(processValue * (phaseCards.length - 1) - index));
        card.style.setProperty('--phase-focus', focus.toFixed(3));
      });
    }
    const settling = Math.abs(stageTarget - stageValue) > .0005 || Math.abs(processTarget - processValue) > .0005;
    if (settling) animationFrame = requestAnimationFrame(render);
    else lastTime = 0;
  }

  function schedule() {
    needsMeasure = true;
    if (!animationFrame && !document.hidden) animationFrame = requestAnimationFrame(render);
  }
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule, { passive: true });
  reduced.addEventListener('change', schedule);
  compact.addEventListener('change', schedule);
  addEventListener('pageshow', schedule);
  addEventListener('load', schedule, { once: true });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(animationFrame); animationFrame = 0; lastTime = 0; }
    else schedule();
  });
  document.querySelectorAll('.filters button,.work-filter-set button').forEach(button => button.addEventListener('click', schedule));
  schedule();
}
