import './internal-editorial.css';

// Progressive enhancement is deliberately limited to internal routes.
const route = location.pathname;
if (route !== '/' && !route.endsWith('/index.html')) {
  document.body.classList.add('internal-editorial');
  const figure = (file, alt, caption, eager = false) => {
    const node = document.createElement('figure');
    node.className = 'editorial-media';
    const image = document.createElement('img');
    image.src = `/assets/${file}`;
    image.alt = alt;
    image.loading = eager ? 'eager' : 'lazy';
    image.decoding = 'async';
    node.append(image);
    if (caption) { const label = document.createElement('figcaption'); label.textContent = caption; node.append(label); }
    return node;
  };
  const hero = (selector, file, alt, caption) => {
    const title = document.querySelector(selector);
    if (!title) return;
    const text = document.createElement('div');
    while (title.firstChild) text.append(title.firstChild);
    title.append(text, figure(file, alt, caption, true));
    title.classList.add('editorial-opening');
  };
  hero('.services-catalogue-title', 'services-official.png', 'BrandShip services artwork', 'Strategy · Identity · Communication');
  hero('.work-catalogue-title', 'madina-made.jpg', 'Madina Made project', 'Selected work · Madina Made');
  hero('.insights-catalogue-title', 'insight-book.png', 'Arabic branding book featured by BrandShip', 'Ideas, culture and brand knowledge');
  hero('.careers-catalogue-title', 'careers-01.jpg', 'People connecting at a creative industry event', 'Life, ideas and connection');

  const firstInsight = document.querySelector('.insight-entry-visual');
  if (firstInsight) firstInsight.replaceWith(figure('insight-ai.jpg', 'Branding in the world of AI', ''));
  const bookIndex = document.querySelector('#insight-book .insight-entry-index');
  if (bookIndex) bookIndex.replaceWith(figure('insight-book.png', 'Arabic book on branding', ''));
  const culture = document.querySelector('.career-culture-stage');
  if (culture) {
    const gallery = document.createElement('div'); gallery.className = 'editorial-culture-gallery';
    gallery.append(figure('careers-02.jpg', 'BrandShip published culture photograph', ''), figure('careers-03.jpg', 'BrandShip published culture photograph', ''));
    culture.after(gallery);
  }
  const contact = document.querySelector('.enquiry-layout>div');
  if (contact) contact.append(figure('jeddah-central.png', 'Jeddah Central project', 'Our work · Jeddah Central'));
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      if (!reduced.matches) entry.target.classList.add('editorial-visible');
      observer.unobserve(entry.target);
    }
  }), { threshold: .1 });
  document.querySelectorAll('.editorial-media,.case-proof,.case-facts,.enquiry-form').forEach(el => observer.observe(el));
  const media = [...document.querySelectorAll('.editorial-opening .editorial-media')];
  let frame;
  const update = () => {
    frame = null;
    media.forEach(el => {
      const rect = el.getBoundingClientRect();
      const offset = reduced.matches || innerWidth < 801 ? 0 : Math.max(-10, Math.min(10, (innerHeight / 2 - rect.top - rect.height / 2) * .035));
      el.style.setProperty('--editorial-offset', `${offset}px`);
    });
  };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule);
  reduced.addEventListener('change', schedule);
  update();
}
