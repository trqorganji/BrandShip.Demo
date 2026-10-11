import './leadership-motion.css';

const leadership = document.querySelector('.about-leadership');
if (leadership) {
  leadership.classList.add('editorial-leadership');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('leader-arrived');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .12 });
  leadership.querySelectorAll('.leadership-grid > article').forEach((card, index) => {
    card.style.setProperty('--leader-delay', `${index === 0 ? 0 : ((index - 1) % 3) * 100}ms`);
    if (reduced.matches) card.classList.add('leader-arrived');
    else observer.observe(card);
  });
}
