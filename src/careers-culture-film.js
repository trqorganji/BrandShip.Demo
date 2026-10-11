import './careers-culture-film.css';

const culture = document.querySelector('.career-culture');
if (culture) {
  const photographs = [...culture.querySelectorAll('.editorial-culture-gallery img')];
  const chapters = [
    { title: 'Think with purpose.', text: 'Ideas grounded in culture. Ambition shaped through connection.' },
    { title: 'Connect through ideas.', text: 'Different perspectives. Shared conversations. A stronger creative exchange.' },
    { title: 'Make meaningful work.', text: 'Strategy, creativity and craft. Connected by purpose.' }
  ];
  const sources = [photographs[0]?.src, photographs[1]?.src, `${import.meta.env.BASE_URL}assets/careers-01.jpg`];
  culture.classList.add('culture-cinema');
  culture.innerHTML = `<header class="culture-cinema-intro"><span>Life at Brandship</span><h2>People. Ideas. <em>Possibility.</em></h2><p>Brandship is home to people who care about ideas, craft, connection and the brands shaping Saudi Arabia’s future.</p></header><div class="culture-film-track"><div class="culture-film-sticky"><div class="culture-film-screen">${chapters.map((chapter, index) => `<figure class="culture-film-scene" data-scene="${index}"><img src="${sources[index]}" alt="${['Conversations at a Brandship industry event', 'Brandship materials and people at an event', 'People exchanging ideas at a creative industry event'][index]}" loading="lazy"/><figcaption><span>0${index + 1} / Life at Brandship</span><h3>${chapter.title}</h3><p>${chapter.text}</p></figcaption></figure>`).join('')}<div class="culture-film-meter" aria-hidden="true"><span></span></div><span class="culture-film-cue" aria-hidden="true">Scroll to explore</span></div></div></div>`;
  const track = culture.querySelector('.culture-film-track');
  const scenes = [...culture.querySelectorAll('.culture-film-scene')];
  const screen = culture.querySelector('.culture-film-screen');
  const captions = document.createElement('div');
  captions.className = 'culture-film-caption-layer';
  captions.innerHTML = chapters.map((chapter,index) => `<div class="culture-stable-caption" data-caption="${index}"><span>0${index+1} / Life at Brandship</span><h3>${chapter.title}</h3><p>${chapter.text}</p></div>`).join('');
  screen.append(captions);
  const captionItems = [...captions.children];
  const cue = culture.querySelector('.culture-film-cue');
  const meter = culture.querySelector('.culture-film-meter');
  meter.innerHTML = '<i><span></span></i><i><span></span></i><i><span></span></i>';
  const simple = matchMedia('(max-width: 800px), (prefers-reduced-motion: reduce)');
  let queued = false;
  const clamp = value => Math.max(0, Math.min(1, value));
  function paint() {
    queued = false;
    culture.classList.toggle('culture-cinema-simple', simple.matches);
    if (simple.matches) {
      scenes.forEach(scene => { scene.style.opacity = '1'; scene.style.setProperty('--scene-depth', '0px'); scene.style.setProperty('--caption-rise', '0px'); });
      return;
    }
    const box = track.getBoundingClientRect();
    if (box.bottom < -100 || box.top > innerHeight + 100) return;
    const progress = clamp((125 - box.top) / Math.max(1, track.offsetHeight - innerHeight + 125));
    culture.style.setProperty('--film-expand', clamp(progress * 5));
    culture.style.setProperty('--film-progress', progress);
    const entries = [1, clamp((progress-.25)/.16), clamp((progress-.6)/.16)];
    const smooth = value => value*value*(3-2*value);
    const active = entries[2] >= .8 ? 2 : entries[1] >= .8 ? 1 : 0;
    cue.textContent = `0${active+1} / 03`;
    captionItems.forEach((caption,index) => {
      caption.classList.toggle('is-active', index===active);
      caption.setAttribute('aria-hidden', String(index!==active));
    });
    meter.querySelectorAll('i>span').forEach((bar,index) => bar.style.transform = `scaleX(${clamp(progress*3-index)})`);
    scenes.forEach((scene, index) => {
      const entrance = smooth(entries[index]);
      const next = index < 2 ? smooth(entries[index+1]) : 0;
      const travel = index === 0 ? -next*3 : (1-entrance)*105-next*3;
      scene.style.opacity = '1';
      scene.style.visibility = 'visible';
      scene.style.clipPath = 'none';
      scene.style.setProperty('--panel-rise', `${travel}%`);
      scene.style.setProperty('--scene-depth', `${-progress * 18}px`);
      scene.style.setProperty('--caption-rise', `${-progress * 10}px`);
      scene.style.setProperty('--scene-zoom', String(1.08 + next*.035));
      scene.style.setProperty('--scene-pan', '0px');
    });
  }
  const schedule = () => { if (!queued) { queued = true; requestAnimationFrame(paint); } };
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule);
  simple.addEventListener('change', () => { scenes.forEach(scene => scene.style.visibility = 'visible'); schedule(); });
  paint();
  // Phones retain a small, one-time reveal rather than the desktop pinned stack.
  const photoReveal = new IntersectionObserver(items => {
    items.forEach(({ target, isIntersecting }) => {
      if (!isIntersecting) return;
      if (matchMedia('(max-width:800px)').matches && !matchMedia('(prefers-reduced-motion:reduce)').matches) {
        const animation = target.animate([
          { opacity: .65, transform: 'translateY(12px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ], { duration: 500, easing: 'cubic-bezier(.2,.7,.2,1)' });
        const cancelIfReduced = () => {
          if (matchMedia('(prefers-reduced-motion:reduce)').matches) animation.cancel();
        };
        simple.addEventListener('change', cancelIfReduced);
        animation.finished.catch(() => {}).finally(() => simple.removeEventListener('change', cancelIfReduced));
      }
      photoReveal.unobserve(target);
    });
  }, { threshold: .15 });
  scenes.forEach(scene => photoReveal.observe(scene));
}
