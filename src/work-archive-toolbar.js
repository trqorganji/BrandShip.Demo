import './work-archive-toolbar.css';

const archive = document.querySelector('.work-catalogue');
if (archive) {
  archive.classList.add('premium-work-archive');
  const content = archive.querySelector('.work-catalogue-content');
  const head = content.querySelector('.work-directory-head');
  const groups = content.querySelector('.work-explore');
  const note = content.querySelector('.work-filter-note');
  const cards = [...content.querySelectorAll('.archive-card')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  head.querySelector('p').textContent = 'Explore by sector';
  const sectorButtons = [...head.querySelectorAll('.filters button')];
  const sectorControl = document.createElement('label');
  sectorControl.className = 'archive-mobile-sector';
  const sectorLabel = document.createElement('span');
  sectorLabel.textContent = 'Sector';
  const sectorSelect = document.createElement('select');
  sectorButtons.forEach((button, index) => {
    const option = document.createElement('option');
    option.value = String(index);
    option.textContent = button.dataset.filter === 'all' ? 'All sectors' : button.textContent.trim();
    option.selected = button.classList.contains('active');
    sectorSelect.append(option);
  });
  sectorControl.append(sectorLabel, sectorSelect);
  head.append(sectorControl);
  sectorSelect.addEventListener('change', () => sectorButtons[Number(sectorSelect.value)]?.click());
  const tools = document.createElement('div');
  tools.className = 'archive-tools';
  tools.innerHTML = '<p class="archive-count" role="status" aria-live="polite"></p><button class="archive-reset" type="button">Clear filters</button><details class="archive-refine"><summary>Refine work <span aria-hidden="true">+</span></summary><div class="archive-refine-panel"></div></details>';
  head.after(tools);
  const panel = tools.querySelector('.archive-refine-panel');
  if (groups) panel.append(groups);
  if (note) panel.append(note);
  const empty = document.createElement('p');
  empty.className = 'archive-empty';
  empty.textContent = 'No projects match these filters. Try another combination or clear the filters.';
  empty.hidden = true;
  content.querySelector('.archive-grid').after(empty);
  let animations = [];
  function update(animate = false) {
    const selectedSector = sectorButtons.findIndex(button => button.classList.contains('active'));
    if (selectedSector >= 0) sectorSelect.value = String(selectedSector);
    const visible = cards.filter(card => !card.classList.contains('hidden'));
    tools.querySelector('.archive-count').textContent = `${String(visible.length).padStart(2, '0')} selected project${visible.length === 1 ? '' : 's'}`;
    const buttons = [...content.querySelectorAll('.filters button, .work-filter-set button')];
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.classList.contains('active'))));
    tools.querySelector('.archive-reset').disabled = !buttons.some(button => button.classList.contains('active') && (button.dataset.filter || button.dataset.value) !== 'all');
    empty.hidden = visible.length > 0;
    animations.forEach(animation => animation.cancel());
    animations = [];
    if (animate && !reduced) animations = visible.map((card, index) => card.animate([{ opacity: .35, transform: 'translateY(6px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 280, delay: Math.min(index * 18, 90), easing: 'cubic-bezier(.2,.7,.2,1)' }));
  }
  content.querySelectorAll('.filters button, .work-filter-set button').forEach(button => button.addEventListener('click', () => queueMicrotask(() => update(true))));
  tools.querySelector('.archive-reset').addEventListener('click', () => {
    groups?.querySelectorAll('.work-filter-set').forEach(set => set.querySelectorAll('button').forEach(button => button.classList.toggle('active', button.dataset.value === 'all')));
    head.querySelector('[data-filter="all"]').click();
  });
  update();
}
