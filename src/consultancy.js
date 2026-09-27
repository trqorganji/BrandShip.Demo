import './internal-editorial.js';
import './official-films.js';
import './refinements.css';
import './project-deck.css';
import './original-client-marks.css';
import './arrow-icons.js';
const baseUrl = import.meta.env.BASE_URL;
document.querySelectorAll('.menu-btn').forEach(button => button.setAttribute('aria-label', 'Open navigation'));

// Labelled line icons keep mobile navigation recognisable without guessing.
const navIcons = {
  '/': 'M3 10 12 3l9 7v11h-6v-7H9v7H3Z',
  '/about.html': 'M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21v-3a8 8 0 0 1 16 0v3',
  '/services.html': 'M4 4h6v6H4ZM14 4h6v6h-6ZM4 14h6v6H4ZM14 14h6v6h-6Z',
  '/work.html': 'M3 7h18v14H3ZM8 7V3h8v4M3 12h18',
  '/insights.html': 'M4 3h16v18H4ZM8 7h8M8 11h8M8 15h5',
  '/careers.html': 'M8 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM2 21v-3a6 6 0 0 1 12 0v3M18 8v8M14 12h8',
  '/contact.html': 'M3 5h18v14H3ZM3 5l9 8 9-8'
};
document.querySelectorAll('.menu nav a').forEach(link => {
  const path = `/${new URL(link.href).pathname.slice(baseUrl.length)}`;
  if (navIcons[path]) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');
    svg.classList.add('mobile-nav-icon');
    const shape = document.createElementNS(svg.namespaceURI, 'path');
    shape.setAttribute('d', navIcons[path]);
    svg.append(shape); link.prepend(svg);
  }
  if (new URL(link.href).pathname === location.pathname) link.setAttribute('aria-current', 'page');
});

// Motion enhances visible content; nothing waits hidden for JavaScript or scrolling.
const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
// Brief first-visit brand signature, never a network-dependent loading gate.
try {
  if (!motionPreference.matches && !sessionStorage.getItem('brandship-arrival-seen')) {
    sessionStorage.setItem('brandship-arrival-seen', '1');
    const arrival = document.createElement('div');
    arrival.className = 'brand-arrival';
    arrival.setAttribute('aria-hidden', 'true');
    arrival.innerHTML = `<img src="${baseUrl}assets/brandship-logo.png" alt=""><span></span>`;
    document.body.append(arrival);
    const dismiss = () => arrival.remove();
    setTimeout(dismiss, 1300);
    addEventListener('keydown', dismiss, { once: true });
    addEventListener('pageshow', event => { if (event.persisted) dismiss(); });
  }
} catch { /* Storage restrictions must not prevent access to the page. */ }
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    if (!motionPreference.matches) entry.target.classList.add('premium-enter');
    revealObserver.unobserve(entry.target);
  });
}, { threshold: .12 });
document.querySelectorAll('.service-stream article,.archive-card,.insight-entry,.career-section-head,.consultancy-close,.about-directory-content>section,.leadership-grid>article').forEach(el => revealObserver.observe(el));
const images = [...document.querySelectorAll('.archive-card figure,.about-editorial-image')];
images.forEach(el => el.classList.add('premium-parallax'));
let motionFrame = 0;
function updateParallax() {
  motionFrame = 0;
  images.forEach(el => {
    const bounds = el.getBoundingClientRect();
    const enabled = !motionPreference.matches && innerWidth > 800;
    const shift = enabled ? Math.max(-12, Math.min(12, (innerHeight / 2 - bounds.top - bounds.height / 2) * .035)) : 0;
    el.style.setProperty('--image-shift', `${shift}px`);
  });
}
function scheduleParallax() { if (!motionFrame) motionFrame = requestAnimationFrame(updateParallax); }
addEventListener('scroll', scheduleParallax, { passive: true });
addEventListener('resize', scheduleParallax);
motionPreference.addEventListener('change', scheduleParallax);
scheduleParallax();
document.querySelectorAll('.filters button').forEach(button => {
  button.setAttribute('aria-pressed', String(button.classList.contains('active')));
  button.addEventListener('click', () => document.querySelectorAll('.filters button').forEach(item => item.setAttribute('aria-pressed', String(item === button))));
});

const stream = document.querySelector('.insight-stream');
if (stream) {
  const tabs = document.createElement('div');
  tabs.className = 'insight-tabs';
  tabs.setAttribute('aria-label', 'Insight categories');
  const entries = [...stream.querySelectorAll('.insight-entry')];
  const categories = ['research', 'magazine', 'magazine', 'research', 'magazine'];
  const empty = document.createElement('p');
  empty.className = 'editorial-note';
  empty.textContent = 'No news articles are currently listed here. Explore Research and Magazine for published perspectives.';
  empty.hidden = true;
  for (const label of ['All', 'Research', 'Magazine', 'News']) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = label;
    button.setAttribute('aria-pressed', String(label === 'All'));
    button.addEventListener('click', () => {
      tabs.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      entries.forEach((entry, index) => entry.hidden = label !== 'All' && categories[index] !== label.toLowerCase());
      empty.hidden = entries.some(entry => !entry.hidden);
    });
    tabs.append(button);
  }
  stream.before(tabs);
  stream.after(empty);
  // The source currently publishes previews, not linked full articles.
  stream.querySelectorAll('a').forEach(link => { link.textContent = 'View on BrandShip’s official site'; link.target = '_blank'; link.rel = 'noopener'; });
}

const form = document.querySelector('.enquiry-form');
if (form) form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const fields = new FormData(form);
  const body = `Name: ${fields.get('name')}\nEmail: ${fields.get('email')}\nOrganisation: ${fields.get('company') || 'Not provided'}\n\n${fields.get('message')}`;
  window.location.href = `mailto:hello@ourbrandship.com?subject=${encodeURIComponent('BrandShip project enquiry')}&body=${encodeURIComponent(body)}`;
  document.querySelector('#enquiry-status').textContent = 'Your email app has been requested. Please send the draft there to complete your enquiry. If it does not open, email hello@ourbrandship.com directly.';
});
