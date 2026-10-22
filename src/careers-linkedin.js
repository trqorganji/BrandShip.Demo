import './careers-linkedin.css';

const positions = document.querySelector('.careers-page .career-positions');
if (positions) {
  const section = document.createElement('section');
  section.className = 'career-connect';
  section.setAttribute('aria-labelledby', 'career-connect-title');
  section.innerHTML = `<div class="career-connect-stage"><div class="career-connect-photos" aria-hidden="true">${['careers-03.jpg', 'careers-02.jpg', 'careers-01.jpg'].map((file, i) => `<figure class="career-connect-photo photo-${i + 1}"><img src="${import.meta.env.BASE_URL}assets/${file}" alt="" loading="lazy" decoding="async"></figure>`).join('')}</div><div class="career-connect-copy"><span class="career-connect-label">Stay connected / Brandship</span><p class="career-connect-purpose">Purpose &amp; <span>connection.</span></p><h2 id="career-connect-title">Follow the<br>practice<span>.</span></h2><p>Follow Brandship on LinkedIn for news, ideas and a closer look at our work.</p><a href="https://www.linkedin.com/company/brandship-consultancy" target="_blank" rel="noopener noreferrer">Visit Brandship on LinkedIn<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg><span class="career-connect-sr"> (opens in a new tab)</span></a></div><div class="career-connect-progress" aria-hidden="true"><span></span></div></div></section>`;
  (document.querySelector('.career-culture') || positions).after(section);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = matchMedia('(max-width: 800px)');
  let queued = false;
  function paint() {
    queued = false;
    const rect = section.getBoundingClientRect();
    if (rect.bottom < -100 || rect.top > innerHeight + 100) return;
    const progress = reduced.matches || mobile.matches ? 1 : Math.max(0, Math.min(1, (120 - rect.top) / Math.max(1, section.offsetHeight - innerHeight + 150)));
    section.style.setProperty('--connect-progress', progress);
    section.style.setProperty('--connect-rise', Math.max(0, 1 - progress * 2.1));
    section.style.setProperty('--connect-ink', Math.min(1, progress * 3));
  }
  const schedule = () => { if (!queued) { queued = true; requestAnimationFrame(paint); } };
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule);
  reduced.addEventListener('change', schedule);
  mobile.addEventListener('change', schedule);
  paint();
}
