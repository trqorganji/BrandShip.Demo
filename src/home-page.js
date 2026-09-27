const track = document.querySelector('.home-logo-track');
const projects = document.querySelector('.home-projects');
if (projects) {
 projects.classList.add('project-carousel');
 projects.setAttribute('aria-label', 'Selected projects');
 const controls = document.createElement('div');
 controls.className = 'project-carousel-controls';
 controls.innerHTML = '<button type="button" aria-label="Previous project">←</button><span aria-live="polite">Explore selected work</span><button type="button" aria-label="Next project">→</button>';
 projects.after(controls);
 const move = direction => {const card=projects.firstElementChild;projects.scrollBy({left:direction*(card.getBoundingClientRect().width+24),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});};
 controls.firstElementChild.addEventListener('click',()=>move(-1));
 controls.lastElementChild.addEventListener('click',()=>move(1));
 projects.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();move(e.key==='ArrowRight'?1:-1);}});
 projects.tabIndex=0;
}
if (track) {
  const copy = track.firstElementChild.cloneNode(true);
  copy.setAttribute('aria-hidden', 'true');
  track.append(copy);
  const button = document.querySelector('.home-logo-pause');
  button.addEventListener('click', () => {
    const paused = document.querySelector('.home-trust').classList.toggle('is-paused');
    button.setAttribute('aria-pressed', String(paused));
    button.textContent = paused ? 'Resume logos' : 'Pause logos';
  });
}
