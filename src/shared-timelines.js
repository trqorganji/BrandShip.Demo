import './shared-timelines.css';

// Services remains the reference component; history reuses its stage and cards.
document.querySelectorAll('.method-grid').forEach(grid => grid.classList.add('consistent-timeline'));
const history = document.querySelector('.about-history');
const grid = history?.querySelector('.story-timeline');
if (grid) {
  history.classList.add('shared-timeline-section');
  grid.classList.add('method-grid', 'consistent-timeline');
  const stage = document.createElement('div');
  stage.className = 'motion-method-stage';
  while (history.firstChild) stage.append(history.firstChild);
  history.append(stage);
  const cards = [...grid.querySelectorAll('article')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const compact = matchMedia('(max-width: 800px)');
  const clamp = value => Math.max(0, Math.min(1, value));
  let target = 0;
  let progress = 0;
  let frame = 0;
  let lastTime = 0;
  function measure() {
    const bounds = history.getBoundingClientRect();
    const staticView = reduced.matches || compact.matches;
    target = staticView ? 1 : clamp((110 - bounds.top) / Math.max(1, bounds.height - innerHeight + 110));
    if (staticView) progress = target;
    if (!frame && !document.hidden) frame = requestAnimationFrame(render);
  }
  function render(now) {
    frame = 0;
    const elapsed = lastTime ? Math.min(64, now - lastTime) : 16;
    lastTime = now;
    progress += (target - progress) * (1 - Math.exp(-elapsed / 85));
    grid.style.setProperty('--process-progress', progress.toFixed(4));
    cards.forEach((card, index) => {
      const focus = reduced.matches || compact.matches ? 1 : clamp(1 - Math.abs(progress * (cards.length - 1) - index));
      card.style.setProperty('--phase-focus', focus.toFixed(3));
    });
    if (Math.abs(target - progress) > .0005 && !document.hidden) frame = requestAnimationFrame(render);
    else lastTime = 0;
  }
  addEventListener('scroll', measure, { passive: true });
  addEventListener('resize', measure, { passive: true });
  addEventListener('pageshow', measure);
  reduced.addEventListener('change', measure);
  compact.addEventListener('change', measure);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(frame); frame = 0; lastTime = 0; }
    else measure();
  });
  measure();
}
