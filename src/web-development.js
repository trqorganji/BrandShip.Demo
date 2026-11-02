import './web-development.css';

const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const previews = new IntersectionObserver(entries => entries.forEach(entry => {
  entry.target.classList.toggle('web-preview-visible', entry.isIntersecting && !reduced.matches);
}), { threshold: .2 });

export function createWebPreview() {
  const preview = document.createElement('div');
  preview.className = 'web-browser';
  preview.setAttribute('aria-hidden', 'true');
  preview.innerHTML = '<div class="web-browser-bar"><i></i><i></i><i></i><span>Brandship / digital</span><b>&lt;/&gt;</b></div><div class="web-browser-canvas"><div class="web-layout-main"><span>Brand. Design. Build.</span><strong>A digital<br>first impression<span>.</span></strong><div class="web-code-lines"><i></i><i></i><i></i></div><div class="web-layout-button"></div></div><div class="web-layout-side"><div class="web-module"></div><div class="web-module"></div><div class="web-module"></div></div></div><div class="web-browser-foot"><span>Designed for people</span><span>Built for every screen</span></div>';
  previews.observe(preview);
  return preview;
}

reduced.addEventListener('change', () => {
  if (reduced.matches) document.querySelectorAll('.web-preview-visible').forEach(preview => preview.classList.remove('web-preview-visible'));
});
