import './careers-life-story.css';

const culture = document.querySelector('.culture-cinema');
if (culture) {
  const interlude = document.createElement('div');
  interlude.className = 'life-brand-interlude';
  interlude.setAttribute('aria-hidden', 'true');
  interlude.innerHTML = `<div class="life-brand-sticky"><span>Purpose brings us together.</span><img src="${import.meta.env.BASE_URL}assets/brandship-logo.png" alt=""/><div class="life-brand-orbit"></div><small>The people behind the thinking</small></div>`;
  const story = document.createElement('section');
  story.className = 'life-story-cover';
  story.setAttribute('aria-labelledby', 'life-story-title');
  story.innerHTML = `<header><span class="life-story-label">A closer look / culture story draft</span><h2 id="life-story-title">A shared purpose.<br><em>Different perspectives.</em></h2><p>An editorial preview of the stories we want to share. Everyday photographs, employee perspectives and culture details are pending approval.</p></header><div class="life-story-chapters">${[
    ['01', 'Inside the consultancy', 'Where questions become direction.', 'Research, working sessions and ideas in progress: this chapter will show how a brief develops into a shared creative direction.', 'Workplace photography and an approved project story to follow.'],
    ['02', 'Together', 'The people behind the work.', 'Conversations, different disciplines and the moments between projects: a closer look at the people who bring the practice to life.', 'Team photography and employee perspectives to follow.'],
    ['03', 'Growing here', 'Room to develop your perspective.', 'A space for approved stories about feedback, mentoring, learning and taking responsibility—not a promise of benefits or programmes.', 'Learning practices and employee experiences to be confirmed.'],
    ['04', 'Beyond the workplace', 'Connection beyond the brief.', 'The event photographs above offer a glimpse of Brandship in conversation with the wider creative industry. This chapter will add the context behind those moments.', 'Event names, dates and participation details to be confirmed.']
  ].map(([number, label, title, text, note]) => `<article class="life-story-chapter"><div class="life-story-symbol" aria-hidden="true"><span>${number}</span><i></i><i></i><i></i></div><div><span class="life-story-label">${label}</span><h3>${title}</h3><p>${text}</p><small>${note}</small></div></article>`).join('')}</div><aside class="life-people-preview"><span class="life-story-label">Meet our people / editorial placeholder</span><h3>In their own words.</h3><p>Approved employee stories will share what people work on, how they collaborate, and what they have learned at Brandship.</p><span class="life-voice-quote" aria-hidden="true">“</span><small>Employee name, portrait and first-person perspective pending approval.</small></aside>`;
  culture.append(interlude, story);
  // Preserve the supplied mark's blue dot while adapting white lettering
  // for the light page. The transparent source remains unchanged.
  const filter = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  filter.setAttribute('width', '0');
  filter.setAttribute('height', '0');
  filter.setAttribute('aria-hidden', 'true');
  filter.style.position = 'absolute';
  filter.innerHTML = '<defs><filter id="life-logo-light" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="0 0 0 0 0  -0.64 0 0 0 0.64  -1 0 0 0 1  0 0 0 1 0"/></filter></defs>';
  interlude.prepend(filter);
  const simple = matchMedia('(max-width: 800px), (prefers-reduced-motion: reduce)');
  let pending = false;
  const clamp = value => Math.max(0, Math.min(1, value));
  function paint() {
    pending = false;
    const box = interlude.getBoundingClientRect();
    const storyBox = story.getBoundingClientRect();
    if (box.top > innerHeight + 100 || storyBox.bottom < -100) return;
    const reveal = simple.matches ? 1 : clamp((innerHeight * .8 - box.top) / (innerHeight * .65));
    interlude.style.setProperty('--brand-reveal', reveal);
    // Clip the entire pinned mark at the incoming section's leading edge.
    // Once that edge reaches the heading's reading position, finish the
    // handoff so no fragment remains above the new content.
    const sticky = interlude.querySelector('.life-brand-sticky');
    const stickyBox = sticky.getBoundingClientRect();
    const coverTop = story.getBoundingClientRect().top;
    const covered = !simple.matches && coverTop <= Math.min(innerHeight * .5, stickyBox.top + stickyBox.height * .55);
    sticky.style.visibility = covered ? 'hidden' : 'visible';
    sticky.style.clipPath = simple.matches ? 'none' : `inset(0 0 ${Math.max(0, stickyBox.bottom - coverTop)}px 0)`;
    story.querySelectorAll('.life-story-chapter').forEach(chapter => {
      const rect = chapter.getBoundingClientRect();
      if (rect.bottom < -100 || rect.top > innerHeight + 100) return;
      const progress = simple.matches ? 1 : clamp((innerHeight * .92 - rect.top) / (innerHeight * .5));
      chapter.style.setProperty('--chapter-reveal', progress);
      chapter.style.setProperty('--chapter-turn', `${simple.matches ? 0 : (progress - .5) * 32}deg`);
    });
  }
  const schedule = () => { if (!pending) { pending = true; requestAnimationFrame(paint); } };
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule);
  simple.addEventListener('change', schedule);
  paint();
}
