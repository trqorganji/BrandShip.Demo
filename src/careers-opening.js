import './careers-opening.css';

const opening = document.querySelector('.careers-catalogue-title');
if (opening) {
  opening.classList.add('careers-services-match');
  const copy = opening.querySelector(':scope > div');
  const label = document.createElement('span');
  label.className = 'careers-opening-label';
  label.textContent = 'Your next chapter';
  const link = document.createElement('a');
  link.className = 'careers-opening-link';
  link.href = '#positions';
  link.innerHTML = 'Explore opportunities <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v16m-6-6 6 6 6-6"/></svg>';
  copy.append(link);
  const media = opening.querySelector('.editorial-media');
  const image = media.querySelector('img');
  const frame = media.querySelector('.services-image-frame');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  link.addEventListener('click', event => {
    const target = document.querySelector('#positions');
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: reduced.matches ? 'instant' : 'smooth', block: 'start' });
    history.replaceState(null, '', '#positions');
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  });
  if (!reduced.matches && !opening.classList.contains('premium-services-opening')) {
    copy.animate([{opacity:0,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],{duration:700,easing:'cubic-bezier(.2,.7,.2,1)'});
    frame.animate([{opacity:0,clipPath:'inset(6% 0 6% 0)'},{opacity:1,clipPath:'inset(0)'}],{duration:900,easing:'cubic-bezier(.2,.7,.2,1)'});
  }
  let pending = false;
  const paint = () => {
    pending = false;
    const box = opening.getBoundingClientRect();
    const depth = reduced.matches ? 0 : Math.max(-18,Math.min(18,-box.top*.045));
    opening.style.setProperty('--careers-depth', `${depth}px`);
    opening.style.setProperty('--careers-line', reduced.matches ? 1 : Math.max(0,Math.min(1,(innerHeight-box.bottom+180)/220)));
  };
  const schedule = () => { if (!pending) { pending = true; requestAnimationFrame(paint); } };
  addEventListener('scroll',schedule,{passive:true});
  addEventListener('resize',schedule);
  reduced.addEventListener('change',schedule);
  paint();
}
