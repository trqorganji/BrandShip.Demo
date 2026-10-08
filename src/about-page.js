import './brand-dot-film.css';
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const signature = document.querySelector('.about-brand-signature');
if (signature) {
  const video = document.createElement('video');
  video.className = 'brand-dot-film';
  video.src = `${import.meta.env.BASE_URL}assets/brandship-dot-loop.mp4`;
  video.autoplay = !reducedMotion.matches;
  video.muted = true;
  video.defaultMuted = true;
  video.loop = true;
  video.playsInline = true;
  video.controls = false;
  video.preload = 'metadata';
  video.setAttribute('aria-hidden', 'true');
  // Retain the original image as the accessible name and loading/error fallback.
  signature.append(video);
  let visible = false;
  function updateSignature() {
    if (visible && !document.hidden && !reducedMotion.matches) video.play().catch(() => {});
    else video.pause();
    signature.classList.toggle('dot-film-active', !reducedMotion.matches && video.readyState >= 2);
  }
  video.addEventListener('playing', updateSignature);
  video.addEventListener('loadeddata', updateSignature);
  video.addEventListener('error', () => signature.classList.remove('dot-film-active'));
  new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    updateSignature();
  }, { threshold: .1 }).observe(signature);
  document.addEventListener('visibilitychange', updateSignature);
  reducedMotion.addEventListener('change', updateSignature);
}
// A fixed portrait frame keeps the crop and card dimensions stable on hover.
document.querySelectorAll('.leadership-grid article > img').forEach(image => {
  const frame = document.createElement('div');
  frame.className = 'leadership-portrait';
  image.before(frame);
  frame.append(image);
});
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
