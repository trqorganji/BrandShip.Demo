import './insights-opening.css';

const opening = document.querySelector('.insights-catalogue-title');
if (opening) {
  opening.classList.add('intelligence-opening');
  const copy = opening.querySelector(':scope > div');
  const label = document.createElement('span');
  label.className = 'intelligence-label';
  label.textContent = 'Brandship Intelligence';
  copy.prepend(label);
  const media = opening.querySelector('.editorial-media');
  const frame = document.createElement('div');
  frame.className = 'intelligence-frame';
  const image = media.querySelector('img');
  image.before(frame);
  frame.append(image);
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    copy.animate([{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'translateY(0)'}],{duration:700,easing:'cubic-bezier(.2,.7,.2,1)'});
    frame.animate([{clipPath:'inset(8% 0 8% 0)',opacity:0},{clipPath:'inset(0)',opacity:1}],{duration:900,easing:'cubic-bezier(.2,.7,.2,1)'});
  }
  queueMicrotask(() => {
    document.querySelectorAll('.insight-tabs button').forEach(button => button.addEventListener('click', () => {
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      document.querySelectorAll('.insight-entry:not([hidden])').forEach(entry => entry.animate([{opacity:.4},{opacity:1}],{duration:240}));
    }));
  });
}
