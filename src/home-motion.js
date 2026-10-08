import './home-motion.css';

if (document.body.classList.contains('home-page')) {
  document.body.classList.add('home-motion');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const compact = matchMedia('(max-width: 800px)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const clamp = value => Math.max(0, Math.min(1, value));
  const ease = value => value * value * (3 - 2 * value);
  const hero = document.querySelector('.hero');
  const manifesto = document.querySelector('.brand-manifesto');
  const selected = document.querySelector('.home-selected');
  const deck = document.querySelector('.project-deck');
  const purpose = document.querySelector('.brand-purpose');

  function wrapScene(section, className) {
    if (!section) return;
    const scene = document.createElement('div');
    scene.className = className;
    while (section.firstChild) scene.append(section.firstChild);
    section.append(scene);
  }
  wrapScene(manifesto, 'home-manifesto-scene');
  wrapScene(selected, 'home-work-scene');

  const manifestoWords = [...(manifesto?.querySelectorAll('.manifesto-copy h2>span') || [])];
  const manifestoCopy = manifesto?.querySelector('.manifesto-copy');
  let filmLink;
  manifestoWords.forEach((word, index) => word.style.setProperty('--word-index', String(index)));
  if (manifesto) {
    const orbit = document.createElement('div');
    orbit.className = 'home-manifesto-orbit';
    orbit.setAttribute('aria-hidden', 'true');
    manifesto.querySelector('.home-manifesto-scene').prepend(orbit);
    const originalLink = manifestoCopy?.querySelector('a');
    if (originalLink) {
      filmLink = originalLink.cloneNode(true);
      filmLink.classList.add('home-film-link');
      filmLink.inert = true;
      manifesto.querySelector('.home-manifesto-scene').append(filmLink);
    }
  }
  if (purpose) {
    const ribbon = document.createElement('div');
    ribbon.className = 'home-purpose-ribbon';
    ribbon.setAttribute('aria-hidden', 'true');
    ribbon.innerHTML = '<span>Think With Purpose</span><i></i><span>Think With Purpose</span>';
    purpose.prepend(ribbon);
  }

  const entrances = document.querySelectorAll('.home-section-head,.home-service-groups article,.home-articles>a,.home-conversation>*,.purpose-copy,.brand-purpose .official-film');
  entrances.forEach((element, index) => {
    element.classList.add('home-motion-entry');
    element.style.setProperty('--home-entry-delay', `${index % 2 * 100}ms`);
  });
  const observer = new IntersectionObserver(entries => {
    entries.forEach(({ target, isIntersecting }) => {
      if (!isIntersecting) return;
      if (!reduced.matches) target.classList.add('home-motion-arrived');
      observer.unobserve(target);
    });
  }, { threshold: .12 });
  entrances.forEach(element => observer.observe(element));

  let frame = 0;
  let lastTime = 0;
  let needsMeasure = true;
  let lastDeckIndex = -1;
  const targets = { hero: 0, manifesto: 0, work: 0, purpose: 0 };
  const values = { ...targets };
  const pinnedProgress = section => {
    if (!section) return 0;
    const rect = section.getBoundingClientRect();
    return clamp(-rect.top / Math.max(1, rect.height - innerHeight));
  };

  function measure() {
    const staticView = reduced.matches || compact.matches;
    if (hero) targets.hero = reduced.matches ? 0 : clamp(-hero.getBoundingClientRect().top / hero.offsetHeight);
    targets.manifesto = staticView ? 0 : pinnedProgress(manifesto);
    if (selected) {
      const rect = selected.getBoundingClientRect();
      targets.work = staticView ? 0 : clamp((110 - rect.top) / Math.max(1, rect.height - innerHeight + 110));
      if (!staticView && deck && rect.top <= 110 && rect.bottom >= innerHeight) {
        const count = deck.querySelectorAll('.home-project').length;
        const index = Math.min(count - 1, Math.floor(targets.work * count));
        if (index !== lastDeckIndex) {
          // Retain a focused card while someone is using its link or keyboard controls.
          if (!selected.contains(document.activeElement)) deck.dispatchEvent(new CustomEvent('brandship:deck-select', { detail: { index } }));
          lastDeckIndex = index;
        }
      } else lastDeckIndex = -1;
    }
    if (purpose) {
      const rect = purpose.getBoundingClientRect();
      targets.purpose = reduced.matches ? .5 : clamp((innerHeight - rect.top) / (innerHeight + rect.height));
    }
    if (staticView) Object.assign(values, targets);
    needsMeasure = false;
  }

  function render(now) {
    frame = 0;
    if (document.hidden) return;
    if (needsMeasure) measure();
    const elapsed = lastTime ? Math.min(64, now - lastTime) : 16;
    lastTime = now;
    const damping = 1 - Math.exp(-elapsed / 95);
    let settling = false;
    Object.keys(values).forEach(key => {
      values[key] += (targets[key] - values[key]) * damping;
      if (Math.abs(targets[key] - values[key]) > .0005) settling = true;
    });
    hero?.style.setProperty('--home-hero-exit', values.hero.toFixed(4));
    if (manifesto) {
      const staticView = compact.matches || reduced.matches;
      const copyFocused = manifestoCopy?.contains(document.activeElement);
      const opening = copyFocused ? 0 : ease(clamp(values.manifesto / .8));
      const copyExit = staticView || copyFocused ? 0 : ease(clamp((values.manifesto - .04) / .24));
      const linkReveal = staticView ? 0 : ease(clamp((values.manifesto - .6) / .18));
      manifesto.style.setProperty('--manifesto-copy-opacity', String(1 - copyExit));
      manifesto.style.setProperty('--manifesto-link-opacity', String(linkReveal));
      if (manifestoCopy) manifestoCopy.inert = copyExit > .99;
      if (filmLink) filmLink.inert = linkReveal < .95;
      manifesto.style.setProperty('--manifesto-inset-left', `${(1 - opening) * 52}%`);
      manifesto.style.setProperty('--manifesto-inset-edge', `${(1 - opening) * 9}%`);
      manifesto.style.setProperty('--manifesto-film-scale', String(1.12 - opening * .12));
      manifesto.style.setProperty('--manifesto-progress', opening.toFixed(4));
      manifesto.classList.toggle('is-immersed', opening > .67 && !compact.matches && !reduced.matches);
      manifestoWords.forEach((word, index) => {
        const focus = clamp(1 - Math.abs(values.manifesto * 2 - index));
        word.style.setProperty('--manifesto-word-focus', focus.toFixed(4));
        word.classList.toggle('is-focused', compact.matches || reduced.matches ? index === 0 : focus >= .5);
      });
    }
    selected?.style.setProperty('--work-scroll', values.work.toFixed(4));
    purpose?.style.setProperty('--purpose-drift', `${-values.purpose * 180}px`);
    if (settling) frame = requestAnimationFrame(render);
    else lastTime = 0;
  }
  function schedule() {
    needsMeasure = true;
    if (!frame && !document.hidden) frame = requestAnimationFrame(render);
  }
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule, { passive: true });
  addEventListener('pageshow', schedule);
  addEventListener('load', schedule, { once: true });
  reduced.addEventListener('change', schedule);
  compact.addEventListener('change', schedule);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(frame); frame = 0; lastTime = 0; }
    else schedule();
  });
  manifestoCopy?.addEventListener('focusin', schedule);
  manifestoCopy?.addEventListener('focusout', schedule);
  if (deck) {
    deck.addEventListener('pointermove', event => {
      if (reduced.matches || compact.matches || !finePointer.matches) return;
      const rect = deck.getBoundingClientRect();
      deck.style.setProperty('--deck-tilt-x', `${(event.clientY - rect.top) / rect.height * -2 + 1}deg`);
      deck.style.setProperty('--deck-tilt-y', `${(event.clientX - rect.left) / rect.width * 2 - 1}deg`);
    }, { passive: true });
    deck.addEventListener('pointerleave', () => {
      deck.style.setProperty('--deck-tilt-x', '0deg');
      deck.style.setProperty('--deck-tilt-y', '0deg');
    }, { passive: true });
  }
  schedule();
}
