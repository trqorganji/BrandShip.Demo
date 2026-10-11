import './services-opening-motion.css';

for (const opening of document.querySelectorAll('.services-catalogue-title.editorial-opening,.careers-catalogue-title.editorial-opening')) {
  opening.classList.add('premium-services-opening');
  const figure = opening.querySelector('.editorial-media');
  const image = figure?.querySelector('img');
  const caption = figure?.querySelector('figcaption');
  if (image) {
    const frame = document.createElement('div');
    frame.className = 'services-image-frame';
    image.before(frame);
    frame.append(image);
  }
  if (caption) caption.classList.add('services-image-caption');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const compact = matchMedia('(max-width:800px)');
  const observer = new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) {
      opening.classList.add('services-opening-arrived');
      observer.disconnect();
    }
  }, { threshold: .15 });
  observer.observe(opening);
  let frame = 0;
  function update() {
    frame = 0;
    const bounds = opening.getBoundingClientRect();
    const depth = reduced.matches || compact.matches ? 0 : Math.max(-12, Math.min(12, (innerHeight / 2 - bounds.top - bounds.height / 2) * .025));
    opening.style.setProperty('--services-depth', `${depth.toFixed(2)}px`);
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(update); }
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule, { passive: true });
  reduced.addEventListener('change', schedule);
  update();
}
