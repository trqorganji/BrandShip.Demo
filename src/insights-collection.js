import './insights-collection.css';

const collection = document.querySelector('.insight-stream');
if (collection) {
  collection.classList.add('premium-insight-collection');
  const entries = [...collection.querySelectorAll('.insight-entry')];
  entries.forEach((entry, index) => {
    if (!entry.querySelector('.insight-entry-copy')) {
      const copy = document.createElement('div');
      copy.className = 'insight-entry-copy';
      while (entry.firstChild) copy.append(entry.firstChild);
      entry.append(copy);
    }
    if (!entry.querySelector('.editorial-media')) {
      const visual = document.createElement('div');
      visual.className = `insight-signal signal-${index % 3}`;
      visual.setAttribute('aria-hidden', 'true');
      visual.innerHTML = `<i></i><i></i><i></i><span>${String(index + 1).padStart(2, '0')}</span>`;
      entry.prepend(visual);
    }
  });
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;
  function paint() {
    frame = 0;
    const bounds = collection.getBoundingClientRect();
    if (bounds.bottom < -100 || bounds.top > innerHeight + 100) return;
    const progress = Math.max(0, Math.min(1, (innerHeight * .8 - bounds.top) / Math.max(1, bounds.height + innerHeight * .5)));
    collection.style.setProperty('--collection-progress', reduced.matches ? 1 : progress);
    entries.forEach(entry => {
      if (entry.hidden) return;
      const box = entry.getBoundingClientRect();
      if (box.bottom < -100 || box.top > innerHeight + 100) return;
      const offset = reduced.matches ? 0 : Math.max(-22, Math.min(22, (innerHeight / 2 - box.top - box.height / 2) * .075));
      entry.style.setProperty('--insight-depth', `${offset}px`);
      entry.style.setProperty('--signal-turn', `${offset * .7}deg`);
    });
  }
  const schedule = () => { if (!frame) frame = requestAnimationFrame(paint); };
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule);
  reduced.addEventListener('change', schedule);
  new MutationObserver(schedule).observe(collection, { subtree: true, attributes: true, attributeFilter: ['hidden'] });
  if (!reduced.matches) {
    const observer = new IntersectionObserver(items => items.forEach(item => {
      if (!item.isIntersecting) return;
      item.target.querySelector('.insight-entry-copy').animate([{ opacity: .25, transform: 'translateY(8px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 450, easing: 'cubic-bezier(.2,.7,.2,1)' });
      observer.unobserve(item.target);
    }), { threshold: .15 });
    entries.forEach(entry => observer.observe(entry));
  }
  paint();
}
