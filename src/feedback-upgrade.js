// Editorial additions from the website review. Unapproved facts are explicitly labelled.
const base = import.meta.env.BASE_URL;
export const originalServiceCapabilities = [...document.querySelectorAll('.service-stream > article')].map(article => ({ name: article.querySelector('h2')?.textContent, description: article.querySelector('p')?.textContent }));
const href = path => `${base}${path}`;
const el = (tag, className, html) => { const node = document.createElement(tag); node.className = className; node.innerHTML = html; return node; };

const serviceCatalogue = document.querySelector('.services-catalogue');
if (serviceCatalogue) {
  const intro = el('section', 'practice-overview', `
    <div class="feedback-heading"><span>Core domains</span><h2>What we solve<span class="blue-stop">.</span></h2></div>
    <div class="practice-overview-grid">
      <a href="${href('practice.html?area=branding')}"><span>Branding</span><h3>Make the brand unmistakable.</h3><p>For organisations that need a clear position and a distinctive visual system.</p><dl><dt>What we solve</dt><dd>Positioning and identity challenges</dd><dt>Illustrative deliverables</dt><dd>Strategic blueprint, identity system, visual language</dd><dt>Selected cases</dt><dd>King Salman Gate · Rua Al Haram</dd></dl><strong>Explore the practice <i aria-hidden="true"></i></strong></a>
      <a href="${href('practice.html?area=communication')}"><span>Marketing &amp; communication</span><h3>Make the brand matter in the world.</h3><p>For organisations connecting their brand with audiences, culture and channels.</p><dl><dt>What we solve</dt><dd>Audience connection and activation</dd><dt>Illustrative deliverables</dt><dd>Communication strategy, content concepts, measurement plan</dd><dt>Selected cases</dt><dd>Madina Made · King Salman Park</dd></dl><strong>Explore the practice <i aria-hidden="true"></i></strong></a>
    </div>`);
  serviceCatalogue.after(el('section', 'method-section', `<div class="feedback-heading"><h2>How we work<span class="blue-stop">.</span></h2></div><div class="method-grid"><article><small>01 / Discover</small><b>Listen &amp; research</b><p>Understand audiences, context and the brief.</p></article><article><small>02 / Define</small><b>Set direction</b><p>Align purpose, position and strategic priorities.</p></article><article><small>03 / Create</small><b>Build the system</b><p>Express the idea through identity, voice and experience.</p></article><article><small>04 / Activate</small><b>Bring it to life</b><p>Plan channels, launch and stakeholder touchpoints.</p></article><article><small>05 / Measure</small><b>Govern &amp; learn</b><p>Review signals and maintain consistency.</p></article></div>`));
  serviceCatalogue.querySelector('.service-stream')?.before(intro);
  serviceCatalogue.querySelector('.service-stream')?.remove();
}

const workContent = document.querySelector('.work-catalogue-content');
if (workContent) {
  const filterGroups = el('div', 'work-explore', `<div><span>Explore by practice</span><div class="work-filter-set" data-group="practice"><button type="button" class="active" data-value="all">All practices</button><button type="button" data-value="branding">Branding</button><button type="button" data-value="communication">Marketing &amp; communication</button></div></div><div><span>Explore by challenge</span><div class="work-filter-set" data-group="challenge"><button type="button" class="active" data-value="all">All challenges</button><button type="button" data-value="destination">Destination &amp; place</button><button type="button" data-value="institution">Institutional identity</button><button type="button" data-value="audience">Audience engagement</button></div></div>`);
  workContent.querySelector('.work-directory-head')?.after(filterGroups);
  filterGroups.insertAdjacentHTML('afterend', '<p class="work-filter-note">Practice and challenge labels are draft classifications for this prototype. Confirm each assignment with the project team before launch.</p>');
  const cards = [...workContent.querySelectorAll('.archive-card')];
  cards.forEach(card => {
    const scope = card.querySelector('p')?.textContent.toLowerCase() || '';
    const sector = card.dataset.sector || '';
    card.dataset.practice = /campaign|activation|launch/.test(scope) ? 'branding communication' : 'branding';
    card.dataset.challenge = /real-estate|destination|hospitality/.test(sector) ? 'destination' : /retail/.test(sector) ? 'audience' : 'institution';
  });
  const apply = () => {
    const sector = document.querySelector('.filters button.active')?.dataset.filter || 'all';
    const practice = filterGroups.querySelector('[data-group="practice"] .active')?.dataset.value || 'all';
    const challenge = filterGroups.querySelector('[data-group="challenge"] .active')?.dataset.value || 'all';
    cards.forEach(card => card.classList.toggle('hidden', !((sector === 'all' || card.dataset.sector.split(' ').includes(sector)) && (practice === 'all' || card.dataset.practice.split(' ').includes(practice)) && (challenge === 'all' || card.dataset.challenge === challenge))));
  };
  workContent.querySelectorAll('.filters button').forEach(button => button.addEventListener('click', apply));
  filterGroups.querySelectorAll('button').forEach(button => button.addEventListener('click', () => { const set = button.parentElement; set.querySelectorAll('button').forEach(item => { item.classList.toggle('active', item === button); item.setAttribute('aria-pressed', String(item === button)); }); apply(); }));
  filterGroups.querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', String(button.classList.contains('active'))));
}

const insights = document.querySelector('.insights-catalogue-content');
if (insights) {
  const head = insights.querySelector('.insights-directory-head');
  head?.querySelector('span')?.replaceChildren(document.createTextNode('Research · Perspectives · Reports · Sector insights · Magazine · News'));
  head?.insertAdjacentHTML('beforeend', `<p class="approval-note">Reports and News below are layout placeholders; only approved publications should appear at launch.</p>`);
  const existingEntries = [...insights.querySelectorAll('.insight-entry')];
  existingEntries.forEach((entry, index) => entry.dataset.topic = ['research', 'magazine', 'perspectives', 'research', 'sector'][index]);
  const stream = existingEntries[0]?.parentElement;
  stream?.insertAdjacentHTML('beforeend', `<article class="insight-entry insight-placeholder" data-topic="reports"><span>Report · sample content</span><h2>Brand signals in a changing market</h2><p>Placeholder for a future downloadable report. Research, date and findings pending approval.</p></article><article class="insight-entry insight-placeholder" data-topic="news"><span>News · sample content</span><h2>A new chapter in the Brandship story</h2><p>Placeholder for a verified company announcement, with date and supporting details.</p></article>`);
  const entries = [...insights.querySelectorAll('.insight-entry')];
  // The site already has filtering logic; extend its vocabulary without a second competing control.
  requestAnimationFrame(() => {
    const tabs = insights.querySelector('.insight-tabs');
    if (!tabs) return;
    tabs.replaceChildren();
    [['All', 'all'], ['Research', 'research'], ['Perspectives', 'perspectives'], ['Reports', 'reports'], ['Sector insights', 'sector'], ['Magazine', 'magazine'], ['News', 'news']].forEach(([label, topic]) => {
      const button = document.createElement('button'); button.type = 'button'; button.textContent = label; button.setAttribute('aria-pressed', String(topic === 'all'));
      button.addEventListener('click', () => { tabs.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', String(item === button))); entries.forEach(entry => entry.hidden = topic !== 'all' && entry.dataset.topic !== topic); });
      tabs.append(button);
    });
  });
}

const caseOverview = document.querySelector('.case-overview');
if (caseOverview) {
  const grid = caseOverview.querySelector('.story-grid');
  grid?.querySelector('.response-card')?.insertAdjacentHTML('beforebegin', `<article class="case-bridge"><span>The insight</span><h3>Research finding to be confirmed.</h3><p>Project-specific research insights will be added after client approval.</p></article>`);
  grid?.querySelector('.response-head span')?.replaceChildren(document.createTextNode('The strategy'));
  document.querySelector('.case-proof-copy .case-label')?.replaceChildren(document.createTextNode('What Brandship did'));
  document.querySelector('.case-delivery .case-kicker p')?.replaceChildren(document.createTextNode('From brief to expression'));
  document.querySelector('.case-output .case-label')?.replaceChildren(document.createTextNode('Deliverables'));
  document.querySelector('.case-output')?.querySelectorAll('.case-label')[1]?.replaceChildren(document.createTextNode('Intended strategic value'));
  document.querySelector('.case-output')?.insertAdjacentHTML('afterend', `<div class="case-impact-note"><span>Measured impact</span><p>Approved performance results and client testimonial to be added when available.</p></div>`);
  document.querySelector('.case-impact-note')?.insertAdjacentHTML('beforeend', '<div class="case-impact-sample"><strong>35%</strong><small>Illustrative result for the demo. Replace with a verified measure and its source.</small></div>');
  caseOverview.insertAdjacentHTML('afterbegin', '<p class="case-draft-label">Illustrative case-story structure · copy and results pending client approval</p>');
}
