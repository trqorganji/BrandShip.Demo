import './about-people.css';
import { people } from './team-people-data.mjs';

const base = import.meta.env.BASE_URL;
function showDirectorMessage(person) {
  const quote = document.querySelector('#directors-word');
  quote.hidden = !person.director;
  quote.parentElement.hidden = quote.hidden;
  quote.dataset.director = person.director ? person.id : '';
  const message = document.querySelector('#director-message');
  message.replaceChildren();
  if (!person.director) return;
  const label = document.createElement('span');
  const copy = document.createElement(person.quote?.approved === true ? 'blockquote' : 'p');
  if (person.quote?.approved === true) {
    label.textContent = `A word from ${person.name}`;
    copy.textContent = person.quote.text;
  } else {
    label.textContent = 'Message awaiting approval';
    copy.textContent = 'Approved messages from our directors will appear here.';
  }
  message.append(label, copy);
}

const carousel = document.querySelector('.people-carousel');
if (carousel) {
  const find = id => carousel.querySelector(`#${id}`);
  const filter = find('people-team-filter');
  const profile = find('people-profile');
  const image = find('people-photo');
  const previous = find('people-previous');
  const next = find('people-next');
  const portrait = carousel.querySelector('.people-portrait');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let entries = people;
  let index = 0;
  let targetIndex = 0;
  let visible = false;
  let focused = false;
  let keyboardNavigation = false;
  let timer;
  let renderId = 0;
  let animation;
  let transitioning = false;
  const interval = 3000;
  function schedule() {
    clearTimeout(timer);
    carousel.dataset.playing = String(!transitioning && !focused && !reduced.matches && visible && !document.hidden && entries.length > 1);
    if (carousel.dataset.playing === 'true') timer = setTimeout(() => show(index + 1, false), interval);
  }
  const canAnimate = () => !reduced.matches && visible && !document.hidden && typeof profile.animate === 'function';
  async function show(position, manual = true, direction = 1) {
    clearTimeout(timer);
    const token = ++renderId;
    animation?.cancel();
    transitioning = true;
    carousel.dataset.transitioning = 'true';
    profile.setAttribute('aria-busy', 'true');
    schedule();
    const nextIndex = (position + entries.length) % entries.length;
    targetIndex = nextIndex;
    const person = entries[nextIndex];
    const incoming = new Image();
    incoming.src = `${base}${person.image}`;
    let available = true;
    try { await incoming.decode(); } catch { available = false; }
    if (token !== renderId) return;
    const changed = Boolean(carousel.dataset.person && carousel.dataset.person !== person.id);
    // Keep the current person on screen until the next portrait has decoded.
    // Animate the complete profile so the name, role and quote stay with its photo.
    if (changed && canAnimate()) {
      animation = profile.animate([
        { opacity: 1, transform: 'translateX(0)' },
        { opacity: 0, transform: `translateX(${-direction * 32}px)` },
      ], { duration: 130, easing: 'cubic-bezier(.4,0,1,1)', fill: 'forwards' });
      await animation.finished.catch(() => {});
      if (token !== renderId) return;
    }
    index = nextIndex;
    image.hidden = !available;
    carousel.querySelector('.people-photo-unavailable').hidden = available;
    image.alt = person.name;
    if (available) image.src = incoming.src;
    find('people-name').textContent = person.name;
    find('people-role').textContent = person.role;
    find('people-team').textContent = person.team;
    profile.setAttribute('aria-label', `${person.name}, ${index + 1} of ${entries.length}`);
    carousel.dataset.person = person.id;
    showDirectorMessage(person);
    previous.disabled = next.disabled = entries.length < 2;
    animation?.cancel();
    if (changed && canAnimate()) {
      carousel.dataset.direction = direction < 0 ? 'previous' : direction > 0 ? 'next' : 'filter';
      animation = profile.animate([
        { opacity: 0, transform: `translateX(${direction * 48}px)` },
        { opacity: 1, transform: 'translateX(0)' },
      ], { duration: 320, easing: 'cubic-bezier(.22,1,.36,1)' });
      await animation.finished.catch(() => {});
      if (token !== renderId) return;
    }
    animation = undefined;
    transitioning = false;
    carousel.dataset.transitioning = 'false';
    profile.setAttribute('aria-busy', 'false');
    if (manual) find('people-announcement').textContent = `${person.name}. ${person.role}. ${index + 1} of ${entries.length}.`;
    schedule();
    // Fetch only the next portrait, not the entire organisation on page load.
    const upcoming = entries[(index + 1) % entries.length];
    if (visible && upcoming) { const preload = new Image(); preload.src = `${base}${upcoming.image}`; }
  }
  [...new Set(people.map(person => person.team))].forEach(team => {
    const option = document.createElement('option');
    option.value = team;
    option.textContent = team;
    filter.append(option);
  });
  find('people-filter-label').hidden = false;
  carousel.querySelector('.people-controls').hidden = false;
  filter.addEventListener('change', () => {
    entries = people.filter(person => !filter.value || person.team === filter.value);
    show(0, true, 0);
  });
  previous.addEventListener('click', () => show(targetIndex - 1, true, -1));
  next.addEventListener('click', () => show(targetIndex + 1));
  // Pointer hover and the focus left behind by an arrow click must not stop
  // autoplay. Only keyboard interaction pauses it until focus leaves the region.
  document.addEventListener('keydown', event => { if (event.key === 'Tab') keyboardNavigation = true; });
  document.addEventListener('pointerdown', () => {
    keyboardNavigation = false;
    if (focused) { focused = false; schedule(); }
  }, { passive: true });
  carousel.addEventListener('focusin', () => { focused = keyboardNavigation; schedule(); });
  carousel.addEventListener('focusout', event => {
    if (!carousel.contains(event.relatedTarget)) { focused = false; schedule(); }
  });
  carousel.addEventListener('keydown', event => {
    keyboardNavigation = true;
    focused = true;
    schedule();
    if (event.target.closest('select,input,textarea') || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    const direction = event.key === 'ArrowLeft' ? -1 : 1;
    show(targetIndex + direction, true, direction);
  });
  let touch;
  portrait.style.touchAction = 'pan-y';
  portrait.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'touch') return;
    touch = { x: event.clientX, y: event.clientY, id: event.pointerId };
  }, { passive: true });
  portrait.addEventListener('pointerup', event => {
    if (!touch || event.pointerId !== touch.id) return;
    const dx = event.clientX - touch.x, dy = event.clientY - touch.y;
    touch = null;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      const direction = dx < 0 ? 1 : -1;
      show(targetIndex + direction, true, direction);
    }
  }, { passive: true });
  portrait.addEventListener('pointercancel', () => { touch = null; });
  // About navigation opens the inline message, without a duplicate profile card.
  document.querySelectorAll('a[href="#directors-word"]').forEach(link => link.addEventListener('click', async event => {
    event.preventDefault();
    const active = people.find(person => person.id === carousel.dataset.person);
    if (!active?.director || !entries.some(person => person.id === active.id)) {
      entries = people;
      filter.value = '';
      await show(people.findIndex(person => person.director));
    }
    history.replaceState(null, '', '#directors-word');
    carousel.focus({ preventScroll: true });
    find('directors-word').scrollIntoView({ behavior: reduced.matches ? 'instant' : 'smooth', block: 'center' });
  }));
  new IntersectionObserver(items => {
    visible = items[0].isIntersecting;
    if (!visible) animation?.cancel();
    schedule();
  }, { threshold: .2 }).observe(carousel);
  reduced.addEventListener('change', () => { if (reduced.matches) animation?.cancel(); schedule(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) animation?.cancel(); schedule(); });
  show(0, false);
}
