const aboutHero = document.querySelector('.about-page .about-editorial-hero');
if (aboutHero) {
  const signature = aboutHero.querySelector('.about-brand-signature');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const pointer = matchMedia('(hover: hover) and (pointer: fine)');
  const desktop = matchMedia('(min-width: 801px)');
  const clamp = value => Math.max(0, Math.min(1, value));
  aboutHero.classList.add('signature-hero');
  let frame = 0;
  let depthX = 0;
  let depthY = 0;
  function paint() {
    frame = 0;
    const rect = aboutHero.getBoundingClientRect();
    const exit = reduced.matches || !desktop.matches ? 0 : clamp(-rect.top / rect.height);
    signature.style.setProperty('--signature-exit', exit.toFixed(4));
    signature.style.setProperty('--signature-x', `${reduced.matches ? 0 : depthX}px`);
    signature.style.setProperty('--signature-y', `${reduced.matches ? 0 : depthY}px`);
    const links = [...document.querySelectorAll('.about-section-nav a')];
    let active = links[0];
    links.forEach(link => {
      const section = document.getElementById(link.hash.slice(1));
      if (section && section.getBoundingClientRect().top <= innerHeight * .35) active = link;
    });
    links.forEach(link => {
      if (link === active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(paint); }
  signature.addEventListener('pointermove', event => {
    if (!pointer.matches || !desktop.matches || reduced.matches) return;
    const rect = signature.getBoundingClientRect();
    depthX = ((event.clientX - rect.left) / rect.width - .5) * 12;
    depthY = ((event.clientY - rect.top) / rect.height - .5) * 8;
    schedule();
  }, { passive: true });
  signature.addEventListener('pointerleave', () => { depthX = depthY = 0; schedule(); });
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule, { passive: true });
  addEventListener('pageshow', schedule);
  reduced.addEventListener('change', schedule);
  schedule();

}
