import './about-metrics-motion.css';

const section = document.querySelector('.about-numbers');
if (section) {
  section.classList.add('animated-metrics');
  const cards = [...section.querySelectorAll('.about-stat-grid article')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const values = cards.map(card => card.querySelector('strong').textContent.trim());
  cards.forEach((card, index) => {
    card.style.setProperty('--metric-index', index);
    const number = card.querySelector('strong');
    number.setAttribute('aria-label', values[index]);
    const visual = document.createElement('span');
    visual.setAttribute('aria-hidden', 'true');
    visual.textContent = values[index];
    number.replaceChildren(visual);
    card.querySelector('p').textContent = card.querySelector('p').textContent.split(' · ')[0];
  });
  section.querySelector('.numbers-source').textContent = 'Illustrative figures · pending approval. Not verified company facts.';
  let frame = 0;
  let started = false;
  function finish() {
    cancelAnimationFrame(frame);
    cards.forEach((card, index) => {
      card.querySelector('strong span').textContent = values[index];
      card.style.setProperty('--metric-focus', 0);
    });
    section.classList.add('metrics-visible');
    section.style.setProperty('--metric-progress', 1);
  }
  function start() {
    if (started) return;
    started = true;
    section.classList.add('metrics-visible');
    if (reduced.matches) { finish(); return; }
    const beginning = performance.now();
    function animate(now) {
      const elapsed = now - beginning;
      section.style.setProperty('--metric-progress', Math.min(1, elapsed / 2100));
      cards.forEach((card, index) => {
        const progress = Math.max(0, Math.min(1, (elapsed - index * 280) / 1400));
        const eased = 1 - Math.pow(1 - progress, 4);
        // A founding year is revealed intact, never counted as a quantity.
        if (index > 0) card.querySelector('strong span').textContent = `${Math.round(parseInt(values[index], 10) * eased)}${values[index].includes('+') ? '+' : ''}`;
        card.style.setProperty('--metric-focus', Math.sin(progress * Math.PI).toFixed(3));
      });
      if (elapsed < 2200) frame = requestAnimationFrame(animate);
      else finish();
    }
    frame = requestAnimationFrame(animate);
  }
  const observer = new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) { start(); observer.disconnect(); }
  }, { threshold: .2 });
  observer.observe(section);
  reduced.addEventListener('change', () => { if (reduced.matches) finish(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden && started) finish(); });
}
