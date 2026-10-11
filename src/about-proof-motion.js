import './about-proof-motion.css';

const base = import.meta.env.BASE_URL;
const awards = document.querySelector('.about-awards');
if (awards) {
  awards.classList.add('proof-showcase');
  awards.querySelectorAll(':scope > article').forEach(article => article.remove());
  awards.insertAdjacentHTML('beforeend', `
    <div class="proof-feature">
      <div class="proof-copy"><span class="proof-eyebrow">Selected work · destination branding</span><h3>Ideas with a presence in the world.</h3><p>Explore the King Salman Gate case study: a destination brought into focus through strategy, identity and naming.</p><a class="proof-link" href="${base}case-study.html?project=king-salman-gate">Explore the project <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg></a></div>
      <a class="proof-image" href="${base}case-study.html?project=king-salman-gate" aria-label="Explore King Salman Gate"><img src="${base}assets/king-salman-gate.jpg" alt="King Salman Gate destination visual" loading="lazy"/><span>King Salman Gate</span></a>
    </div>
    <div class="recognition-drafts" aria-label="Recognition layout placeholders">
      <div><span class="proof-eyebrow">Milestone · demo placeholder</span><h3>A defining moment.</h3><p>Approved year, company milestone and supporting story will appear here.</p></div>
      <div><span class="proof-eyebrow">Recognition · demo placeholder</span><h3>Recognition that matters.</h3><p>Approved award title, awarding organisation and year will appear here.</p></div>
    </div><p class="proof-note">Recognition entries are layout placeholders, not verified achievements.</p>`);
}

const why = document.querySelector('.why-section');
if (why) {
  why.classList.add('connected-principles');
  why.querySelector('.feedback-heading > span').textContent = 'Why Brandship';
  const grid = why.querySelector('.why-grid');
  const symbols = [
    'M3 17 12 4l9 13M7 17v4h10v-4M9 13h6',
    'M4 12h16M12 4v16M5 5l14 14M5 19 19 5',
    'M4 18 10 4l4 9 6-7M4 21h16',
    'M5 20V9l7-5 7 5v11M9 20v-7h6v7',
    'M4 6h6v6H4ZM14 12h6v6h-6ZM10 9h7v3M7 12v3h7'
  ];
  grid.querySelectorAll('article').forEach((card, index) => {
    card.style.setProperty('--proof-order', index);
    card.querySelector('b').outerHTML = `<svg class="principle-symbol" viewBox="0 0 24 24" aria-hidden="true"><path d="${symbols[index]}"/></svg>`;
  });
  const graphic = document.createElement('div');
  graphic.className = 'clarity-network';
  graphic.setAttribute('aria-hidden', 'true');
  graphic.innerHTML = `<svg viewBox="0 0 1000 100" preserveAspectRatio="none"><g class="complexity-lines">${[8,28,50,72,92].map(y => `<path d="M0 ${y} C160 ${100-y},220 ${y},420 50"/>`).join('')}</g><path class="clarity-line" d="M420 50H1000"/><circle cx="420" cy="50" r="4"/></svg>`;
  grid.before(graphic);
}

// Motion enhances the content; no information is hidden while waiting for scroll.
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('proof-arrived'); observer.unobserve(entry.target); }
  });
}, { threshold: .15 });
document.querySelectorAll('.proof-feature, .recognition-drafts, .connected-principles').forEach(section => {
  if (reduced.matches) section.classList.add('proof-arrived');
  else observer.observe(section);
});
