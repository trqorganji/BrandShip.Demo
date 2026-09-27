import './official-films.css';

const base = import.meta.env.BASE_URL;
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const film = (name, label) => `<figure class="official-film"><video autoplay muted loop playsinline preload="none" poster="${base}assets/${name}.jpg" data-film-src="${base}assets/${name}.mp4" aria-label="${label}"></video><figcaption>${label}<span>BrandShip in motion</span></figcaption></figure>`;
const purpose = `<h2>BrandShip is home to those who<br><em>Think With Purpose</em></h2><p>Fueled by magnetic culture of purpose and connection, backed by the belief that we build iconic Saudi brands</p>`;

if (document.body.classList.contains('home-page')) {
 const about = document.querySelector('.home-about');
 about.className = 'brand-manifesto';
 about.innerHTML = `<div class="manifesto-copy"><p class="home-label">Brands that are</p><h2><span>Strategic</span><span>Rooted</span><span>Inspiring</span></h2><p>BrandShip builds meaningful relationships.</p><a class="home-link" href="${base}about.html">Discover BrandShip ↗</a></div>${film('official-brand-montage', 'Brands that are strategic, rooted and inspiring')}`;
 const section = document.createElement('section');
 section.className = 'brand-purpose';
 section.innerHTML = `<div class="purpose-copy">${purpose}<a class="home-link" href="${base}careers.html">Life at BrandShip ↗</a></div>${film('official-showreel', 'BrandShip showreel')}`;
 document.querySelector('.home-thinking').before(section);
}

if (location.pathname.endsWith('about.html')) {
 const section = document.createElement('section');
 section.className = 'official-culture';
 section.innerHTML = `<div class="purpose-copy">${purpose}</div>${film('official-showreel', 'BrandShip showreel')}<div class="culture-films">${film('official-inspired', 'Inspired')}${film('official-saudi-rooted', 'Saudi rooted')}${film('official-driven', 'Driven')}</div>`;
 document.querySelector('#numbers').before(section);
}

if (location.pathname.endsWith('careers.html')) {
 const target = document.querySelector('#culture') || document.querySelector('.careers-content');
 if (target) target.insertAdjacentHTML('beforeend', film('official-showreel', 'Think With Purpose — life at BrandShip'));
}

// Official ambient film supports the closing invitation, rather than another dark block.
const close = document.querySelector('.consultancy-close');
if (close) {
 close.classList.add('film-close');
 close.insertAdjacentHTML('afterbegin', `<video autoplay muted loop playsinline preload="none" poster="${base}assets/official-gradient.jpg" data-film-src="${base}assets/official-gradient.mp4" aria-hidden="true"></video>`);
}

const videos = [...document.querySelectorAll('[data-film-src]')];
const automatic = new Set();
const observer = new IntersectionObserver(entries => {
 for (const {target: video, isIntersecting} of entries) {
  if (isIntersecting) {
   if (!video.src && !reduced.matches) { video.src = video.dataset.filmSrc; video.load(); }
   if (!reduced.matches && !document.hidden) {
    automatic.add(video); video.play().catch(() => {});
   }
  } else { automatic.delete(video); video.pause(); }
 }
}, {threshold: .25});
videos.forEach(video => {
 video.muted = true;
 video.controls = false;
 observer.observe(video);
});
document.addEventListener('visibilitychange', () => {
 videos.forEach(video => {if (document.hidden) video.pause(); else if (automatic.has(video) && !reduced.matches) video.play().catch(() => {});});
});
reduced.addEventListener('change', () => { if (reduced.matches) videos.forEach(video => video.pause()); });
