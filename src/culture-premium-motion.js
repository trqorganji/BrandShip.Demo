import './culture-premium-motion.css';

const culture = document.querySelector('.about-page .official-culture');
if (culture) {
  const copy = culture.querySelector('.purpose-copy');
  const film = culture.querySelector(':scope > .official-film');
  if (copy && film) {
    culture.classList.add('premium-culture');
    const scene = document.createElement('div');
    scene.className = 'culture-scene';
    const stage = document.createElement('div');
    stage.className = 'culture-stage';
    copy.before(scene);
    scene.append(stage);
    stage.append(copy, film);
    copy.innerHTML = '<span class="culture-kicker">Culture & connection</span><h2><span class="culture-lead">Brandship is home to those who</span><em>Think With Purpose</em></h2><p>Fueled by magnetic culture of purpose and connection, backed by the belief that we build iconic Saudi brands</p>';
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const compact = matchMedia('(max-width: 800px)');
    const clamp = value => Math.max(0, Math.min(1, value));
    let target = 0, value = 0, frame = 0, last = 0;
    function measure() {
      const bounds = scene.getBoundingClientRect();
      target = reduced.matches || compact.matches ? 0 : clamp((110 - bounds.top) / Math.max(1, bounds.height - innerHeight + 110));
      if (!frame && !document.hidden) frame = requestAnimationFrame(render);
    }
    function render(now) {
      frame = 0;
      const dt = last ? Math.min(64, now - last) : 16;
      last = now;
      value += (target - value) * (1 - Math.exp(-dt / 65));
      const opening = clamp(value / .7);
      const eased = opening * opening * (3 - 2 * opening);
      stage.style.setProperty('--culture-inset', `${(1 - eased) * 13}%`);
      stage.style.setProperty('--culture-copy-y', `${-eased * 35}px`);
      stage.style.setProperty('--culture-copy-opacity', 1 - clamp((value - .38) / .32));
      stage.style.setProperty('--culture-film-y', `${-eased * 100}px`);
      stage.style.setProperty('--culture-film-scale', 1.045 - eased * .045);
      stage.style.setProperty('--culture-exit', clamp((value - .75) / .25));
      if (Math.abs(target - value) > .0005 && !document.hidden) frame = requestAnimationFrame(render);
      else last = 0;
    }
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { culture.classList.add('culture-entered'); observer.disconnect(); }
    }, { threshold: .12 });
    observer.observe(scene);
    addEventListener('scroll', measure, { passive: true });
    addEventListener('resize', measure, { passive: true });
    reduced.addEventListener('change', measure);
    compact.addEventListener('change', measure);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) { cancelAnimationFrame(frame); frame = 0; last = 0; }
      else measure();
    });
    measure();
  }
}
