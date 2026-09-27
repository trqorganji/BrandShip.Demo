const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const counters = document.querySelectorAll('[data-count]');
const observer = new IntersectionObserver(entries => {
  entries.forEach(({ target, isIntersecting }) => {
    if (!isIntersecting) return;
    observer.unobserve(target);
    const total = Number(target.dataset.count);
    if (reducedMotion.matches) return;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / 1300, 1);
      target.textContent = Math.round(total * (1 - Math.pow(1 - progress, 3)));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}, { threshold: 0.6 });
counters.forEach(counter => observer.observe(counter));

const wall = document.querySelector('.client-wall');
if (wall) {
  const logos = [...wall.children];
  logos.forEach(logo => {
    // Published marks are white-only. Keep the source untouched and tint
    // their alpha silhouettes blue until full-colour artwork is supplied.
    const img = logo.querySelector('img');
    const mark = document.createElement('span');
    mark.className = 'client-colour-mark';
    mark.setAttribute('aria-hidden', 'true');
    mark.style.setProperty('--logo', `url("${img.getAttribute('src')}")`);
    logo.append(mark);
  });
  const rows = Array.from({ length: 3 }, () => {
    const row = document.createElement('div');
    row.className = 'client-logo-row';
    const track = document.createElement('div');
    track.className = 'client-logo-track';
    const group = document.createElement('div');
    group.className = 'client-logo-group';
    track.append(group);
    row.append(track);
    return row;
  });
  logos.forEach((logo, index) => rows[index % 3].firstChild.firstChild.append(logo));
  rows.forEach(row => {
    const track = row.firstChild;
    const group = track.firstChild;
    // Extend short rows beyond the viewport, then duplicate the entire
    // group so the loop has an identical start and end with no jump.
    [...group.children].forEach(logo => {
      const copy = logo.cloneNode(true);
      copy.setAttribute('aria-hidden', 'true');
      group.append(copy);
    });
    const copy = group.cloneNode(true);
    copy.setAttribute('aria-hidden', 'true');
    track.append(copy);
  });
  wall.replaceChildren(...rows);
  wall.classList.add('client-marquee');
  const pause = document.createElement('button');
  pause.className = 'logo-pause';
  pause.type = 'button';
  pause.textContent = 'Pause logo motion';
  pause.setAttribute('aria-pressed', 'false');
  pause.addEventListener('click', () => {
    const paused = wall.classList.toggle('is-paused');
    pause.setAttribute('aria-pressed', String(paused));
    pause.textContent = paused ? 'Resume logo motion' : 'Pause logo motion';
  });
  wall.after(pause);
}
