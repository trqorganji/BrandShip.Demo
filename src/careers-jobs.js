import './careers-jobs.css';
import { validateCareersContent, careerApplicationHref } from './careers-content.mjs';

const board = document.querySelector('.job-board');
if (board) {
  const find = id => board.querySelector(`#${id}`);
  const list = find('job-board-list');
  const count = find('job-board-count');
  const empty = find('job-board-empty');
  const filters = find('job-board-filters');
  const search = find('job-board-search');
  const team = find('job-board-team');
  const retry = find('job-board-retry');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let jobs = [];
  let loading = false;
  let revealObserver;
  const node = (tag, text, className) => {
    const element = document.createElement(tag);
    if (text !== undefined) element.textContent = text;
    if (className) element.className = className;
    return element;
  };
  function render() {
    revealObserver?.disconnect();
    const query = search.value.trim().toLocaleLowerCase();
    const matches = jobs.filter(job => (!team.value || job.team === team.value) && [job.title, job.team, job.location, job.type, ...job.requirements].join(' ').toLocaleLowerCase().includes(query));
    list.replaceChildren();
    count.textContent = jobs.length ? `${matches.length} ${matches.length === 1 ? 'position' : 'positions'}${query || team.value ? ` matching your search` : ' open'}` : 'General applications';
    empty.hidden = matches.length > 0;
    find('job-board-empty-title').textContent = jobs.length ? 'No roles match those filters.' : 'No open positions at the moment.';
    find('job-board-empty-copy').textContent = jobs.length ? 'Try another keyword or team, or send a general application below.' : 'You can still introduce yourself. Share your experience and the kind of role you have in mind.';
    if (!reduced.matches) revealObserver = new IntersectionObserver(entries => entries.forEach(({ target, isIntersecting }) => {
      if (!isIntersecting) return;
      const animation = target.animate([{ transform: 'translateY(10px)', opacity: .7 }, { transform: 'none', opacity: 1 }], { duration: 400, easing: 'cubic-bezier(.2,.7,.2,1)' });
      const cancel = () => { if (reduced.matches) animation.cancel(); };
      reduced.addEventListener('change', cancel);
      animation.finished.catch(() => {}).finally(() => reduced.removeEventListener('change', cancel));
      revealObserver.unobserve(target);
    }), { threshold: .1 });
    matches.forEach((job, index) => {
      const card = node('article', undefined, 'job-card');
      const header = node('div', undefined, 'job-card-top');
      header.append(node('span', job.team, 'job-team'), node('span', `0${index + 1}`.slice(-2), 'job-index'));
      const title = node('h3', job.title);
      title.id = `job-role-${index}`;
      card.setAttribute('aria-labelledby', title.id);
      const meta = node('p', `${job.location} · ${job.type}`, 'job-meta');
      const requirements = node('ul');
      requirements.setAttribute('aria-label', 'Brief requirements');
      job.requirements.forEach(text => requirements.append(node('li', text)));
      const apply = node('a', 'Apply for this role', 'job-apply');
      apply.href = careerApplicationHref(job.title);
      apply.setAttribute('aria-label', `Apply for ${job.title} by email`);
      const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      arrow.setAttribute('viewBox', '0 0 24 24');
      arrow.setAttribute('aria-hidden', 'true');
      arrow.innerHTML = '<path d="M5 19 19 5M5 5h14v14"/>';
      apply.append(arrow);
      card.append(header, title, meta, node('h4', 'What you’ll bring'), requirements, apply);
      list.append(card);
      revealObserver?.observe(card);
    });
  }
  async function load() {
    if (loading) return;
    loading = true;
    retry.hidden = true;
    filters.hidden = true;
    list.setAttribute('aria-busy', 'true');
    count.textContent = 'Checking open positions…';
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10000);
    try {
      const response = await fetch(`${import.meta.env.BASE_URL}content/careers.json`, { signal: controller.signal, cache: 'no-store', credentials: 'omit', redirect: 'error' });
      if (!response.ok) throw new Error('Unable to load positions.');
      const raw = await response.text();
      if (raw.length > 100000) throw new Error('Content is too large.');
      jobs = validateCareersContent(JSON.parse(raw)).filter(job => job.open);
      team.replaceChildren(node('option', 'All teams'));
      team.firstChild.value = '';
      [...new Set(jobs.map(job => job.team))].sort().forEach(name => { const option = node('option', name); option.value = name; team.append(option); });
      search.value = '';
      filters.hidden = jobs.length < 2;
      render();
      board.dataset.jobsState = 'ready';
    } catch {
      jobs = [];
      list.replaceChildren();
      empty.hidden = false;
      count.textContent = 'Positions temporarily unavailable';
      find('job-board-empty-title').textContent = 'We couldn’t load current positions.';
      find('job-board-empty-copy').textContent = 'Try again, or send your CV directly using the general application link below.';
      retry.hidden = false;
      board.dataset.jobsState = 'error';
    } finally {
      clearTimeout(timer);
      list.setAttribute('aria-busy', 'false');
      loading = false;
    }
  }
  search.addEventListener('input', render);
  team.addEventListener('change', render);
  retry.addEventListener('click', load);
  load();
}
