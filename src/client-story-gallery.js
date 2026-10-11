import './client-story-gallery.css';

const stories = document.querySelector('.about-page .client-stories');
if (stories) {
  stories.classList.add('cinematic-stories');
  const base = import.meta.env.BASE_URL;
  const projects = [
    { name: 'King Salman Gate', id: 'king-salman-gate', image: 'king-salman-gate.jpg', logo: 'client-original-king-salman-gate.png', category: 'Destination identity', challenge: 'Define a distinctive destination.', approach: 'Connect strategy, identity and naming.' },
    { name: 'Rua Al Haram', id: 'rua-al-haram', image: 'rua-al-haram.jpg', logo: 'client-original-rua-al-haram.webp', category: 'Place branding', challenge: 'Connect place and audience.', approach: 'Translate the shared ambition into a brand.' },
    { name: 'Masar', id: 'masar', image: 'masar.png', logo: 'client-original-masar.jpeg', category: 'Destination branding', challenge: 'Give a destination a clear direction.', approach: 'Bring that direction into a connected identity.' }
  ];
  stories.innerHTML = `<header class="story-gallery-heading"><span>Relationships, made tangible</span><h3>Selected client stories</h3><p>Demo story summaries · pending approval.</p></header>
    <div class="client-story-stage">
      <figure class="story-screen">${projects.map((project, index) => `<img class="story-project-image ${index === 0 ? 'story-active' : ''}" data-story-image="${index}" src="${base}assets/${project.image}" alt="${project.name} project visual" aria-hidden="${index !== 0}" loading="lazy"/>`).join('')}</figure>
      <div class="story-panels">${projects.map((project, index) => `<div class="story-card-copy" id="client-story-panel-${index}" role="tabpanel" aria-labelledby="client-story-tab-${index}" ${index === 0 ? '' : 'hidden'}><span>${project.category} · story draft</span><h4>${project.name}</h4><dl><div><dt>Challenge</dt><dd>${project.challenge}</dd></div><div><dt>Approach</dt><dd>${project.approach}</dd></div></dl><a class="story-case-link" href="${base}case-study.html?project=${project.id}">Explore case <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg></a></div>`).join('')}</div>
      <div class="story-selectors" role="tablist" aria-label="Choose a client story">${projects.map((project, index) => `<button type="button" role="tab" id="client-story-tab-${index}" aria-controls="client-story-panel-${index}" aria-selected="${index === 0}" tabindex="${index === 0 ? 0 : -1}"><img src="${base}assets/${project.logo}" alt="" aria-hidden="true" loading="lazy"/><span>${project.name}</span></button>`).join('')}</div>
    </div>
    <div class="testimonial-placeholder story-quote"><svg viewBox="0 0 64 48" aria-hidden="true"><path d="M4 28C4 12 12 4 27 4v8C17 13 14 18 14 24h13v20H4ZM36 28C36 12 44 4 59 4v8C49 13 46 18 46 24h13v20H36Z"/></svg><span>Client voice · demo layout · pending approval</span><blockquote>Approved client testimonial will appear here.</blockquote><p>Client name, role and permission to publish to be confirmed.</p></div>`;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  // Replace the oversized stage with an archive-style index. Links remain direct.
  const stage = stories.querySelector('.client-story-stage');
  stage.className = 'client-story-index';
  stage.innerHTML = `<div class="client-index-list">${projects.map((project, index) => `<a class="client-index-row ${index === 0 ? 'index-active' : ''}" href="${base}case-study.html?project=${project.id}"><img class="index-client-logo" src="${base}assets/${project.logo}" alt="" loading="lazy"/><img class="index-mobile-image" src="${base}assets/${project.image}" alt="" loading="lazy"/><div><h4>${project.name}</h4><span>${project.category}</span></div><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg></a>`).join('')}</div><aside class="client-index-preview" aria-label="Selected story preview"><figure>${projects.map((project, index) => `<img class="index-preview-image ${index === 0 ? 'index-active' : ''}" src="${base}assets/${project.image}" alt="${project.name} project visual" aria-hidden="${index !== 0}" loading="lazy"/>`).join('')}</figure><div class="index-preview-copy">${projects.map((project, index) => `<p ${index === 0 ? '' : 'hidden'}><span>Story draft</span>${project.approach}</p>`).join('')}</div></aside>`;
  const rows = [...stage.querySelectorAll('.client-index-row')];
  const previews = [...stage.querySelectorAll('.index-preview-image')];
  const descriptions = [...stage.querySelectorAll('.index-preview-copy p')];
  rows.forEach((row, index) => {
    const activate = () => rows.forEach((item, position) => {
      item.classList.toggle('index-active', position === index);
      previews[position].classList.toggle('index-active', position === index);
      previews[position].setAttribute('aria-hidden', String(position !== index));
      descriptions[position].hidden = position !== index;
    });
    row.addEventListener('pointerenter', event => { if (event.pointerType !== 'touch') activate(); });
    row.addEventListener('focus', activate);
  });
  const quote = stories.querySelector('.story-quote');
  quote.classList.add('compact-quote');
  const tabs = [...stories.querySelectorAll('[role="tab"]')];
  const panels = [...stories.querySelectorAll('[role="tabpanel"]')];
  const images = [...stories.querySelectorAll('[data-story-image]')];
  let selected = 0;
  function select(index, focus = false) {
    selected = index;
    tabs.forEach((tab, position) => {
      tab.setAttribute('aria-selected', String(position === index));
      tab.tabIndex = position === index ? 0 : -1;
      panels[position].hidden = position !== index;
      images[position].classList.toggle('story-active', position === index);
      images[position].setAttribute('aria-hidden', String(position !== index));
    });
    stories.querySelector('.story-selectors').style.setProperty('--selected-story', index);
    if (focus) tabs[index].focus();
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => select(index));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (selected + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (selected + tabs.length - 1) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) { event.preventDefault(); select(next, true); }
    });
  });
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('story-in-view'); observer.unobserve(entry.target); }
  }), { threshold: .12 });
  stories.querySelectorAll('.client-story-index,.story-quote').forEach(card => {
    if (reduced.matches) card.classList.add('story-in-view');
    else observer.observe(card);
  });
}
