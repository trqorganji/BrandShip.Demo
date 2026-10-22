import './brand-ink-theme.css';
import './brand-glass-canvas.css';

document.body.classList.add('brand-ink');
document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#090c10');

// Surface roles change colour only: content, order and motion controllers stay intact.
const dark = [
  '.hero', '.brand-manifesto', '.home-selected', '.home-offering', '.home-thinking', '.brand-purpose', '.home-trust',
  '.about-editorial-hero', '.about-section-nav', '.about-directory-content > section',
  '.about-numbers', '.about-purpose', '.about-awards', '.about-leadership', '.about-clients',
  '.cinematic-stage', '.official-culture', '.client-stories',
  '.services-catalogue', '.work-catalogue', '.insights-catalogue', '.careers-catalogue',
  '.practice-hero', '.practice-body', '.practice-capabilities', '.practice-deliverables', '.practice-related',
  '.culture-cinema-intro', '.career-connect', '.career-positions',
  '.team-hero', '.team-directory', '.enquiry-layout', '.service-request-form',
  '.work-portfolio-opening', '.insight-feature-dossier', '.future-dark',
  '.cs-hero', '.cs-concept', '.cs-work', '.cs-next'
].join(',');
const light = [
  '.home-conversation', '.about-story-pair', '.client-marquee',
  '.method-section', '.branding-approach-section', '.practice-method',
  '.insights-catalogue-content',
  '.enquiry-form:not(.service-request-form)', '.wider-team', '.consultancy-close', '.cs-brief', '.cs-scope'
].join(',');

function applySurfaces() {
  // Keep Work controls integrated with the surrounding portfolio canvas.
  const head = document.querySelector('.work-directory-head');
  const tools = document.querySelector('.archive-tools');
  if (head && tools && !head.closest('.ink-filter-chapter')) {
    const chapter = document.createElement('div');
    chapter.className = 'ink-filter-chapter ink-dark ink-chapter';
    head.before(chapter);
    chapter.append(head, tools);
  }
  document.querySelectorAll(dark).forEach(section => section.classList.add('ink-dark'));
  document.querySelectorAll(light).forEach(section => {
    section.classList.remove('ink-dark');
    section.classList.add('ink-light');
  });
  document.querySelectorAll('.about-story-pair,.client-marquee,.branding-approach-section,.practice-method,.insights-catalogue-content,.career-positions,.wider-team').forEach(section => section.classList.add('ink-chapter'));
  // The featured cover remains dark inside the light publication chapter.
  document.querySelector('.insight-feature-dossier')?.classList.add('ink-dark');
}

let pending = false;
function schedule() {
  if (pending) return;
  pending = true;
  requestAnimationFrame(() => { pending = false; applySurfaces(); });
}
schedule();
// These renderers replace their own root once; do not watch per-frame text/style changes.
document.querySelectorAll('#main,#practice-root').forEach(root => new MutationObserver(schedule).observe(root, { childList: true }));
