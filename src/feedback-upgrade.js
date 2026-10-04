// Editorial additions from the website review. Unapproved facts are explicitly labelled.
const base = import.meta.env.BASE_URL;
const href = path => `${base}${path}`;
const el = (tag, className, html) => { const node = document.createElement(tag); node.className = className; node.innerHTML = html; return node; };

const aboutContent = document.querySelector('.about-directory-content');
if (aboutContent) {
  const overview = aboutContent.querySelector('#overview');
  const story = el('section', 'feedback-section story-section', `
    <div class="feedback-heading"><span>Our story</span><h2>Built with purpose. Evolving with our clients<span class="blue-stop">.</span></h2></div>
    <p class="feedback-intro">From a Saudi-rooted brand practice to a connected consultancy spanning research, strategy, design and communication. The detailed company chronology will be published once approved.</p>
    <div class="story-timeline" aria-label="BrandShip journey">
      <article><small>Origins · date to confirm</small><h3>A Saudi point of view</h3><p>The founding year and early milestones await confirmation.</p></article>
      <article><small>Growth · dates to confirm</small><h3>A connected practice</h3><p>Key capability and team milestones await confirmation.</p></article>
      <article><small>Today</small><h3>Strategy through expression</h3><p>Branding and marketing communication are presented as two connected practice areas.</p></article>
    </div>`);
  story.id = 'story';
  overview?.after(story);
  const numbers = aboutContent.querySelector('#numbers');
  numbers?.after(el('section', 'feedback-section why-section', `
    <div class="feedback-heading"><span>Why BrandShip</span><h2>Clarity from complexity<span class="blue-stop">.</span></h2></div>
    <p class="feedback-intro">A Saudi perspective connects cultural understanding with rigorous thinking and creative expression. These are the principles that guide how we frame a brief, work with stakeholders and build a brand system.</p>
    <div class="why-grid"><article><b>01</b><h3>Cultural context</h3><p>Start with people, place and the meaning a brand must carry.</p></article><article><b>02</b><h3>Strategic clarity</h3><p>Turn research and competing priorities into a focused direction.</p></article><article><b>03</b><h3>Connected execution</h3><p>Carry the idea coherently from identity to communication and activation.</p></article></div>`));
  const leadership = aboutContent.querySelector('#leadership');
  leadership?.querySelector('header')?.insertAdjacentHTML('beforeend', `<p class="feedback-intro">The leadership roles below reflect the current public team listing. Individual credentials and the wider team directory are pending approval.</p><a class="feedback-text-link" href="${href('team.html')}">Meet the team <span class="feedback-arrow" aria-hidden="true"></span></a>`);
  const clients = aboutContent.querySelector('#clients');
  clients?.insertAdjacentHTML('beforeend', `<div class="client-stories"><h3>Selected client stories</h3><div><a href="${href('case-study.html?project=king-salman-gate')}"><span>Destination identity</span><strong>King Salman Gate</strong><em>Explore case</em></a><a href="${href('case-study.html?project=rua-al-haram')}"><span>Place branding</span><strong>Rua Al Haram</strong><em>Explore case</em></a><a href="${href('case-study.html?project=masar')}"><span>Destination branding</span><strong>Masar</strong><em>Explore case</em></a></div><p class="approval-note">Client testimonials will be added after approval.</p></div>`);
  const sectionNav = document.querySelector('.about-section-nav');
  sectionNav?.querySelector('a[href="#overview"]')?.insertAdjacentHTML('afterend', '<a href="#story">Our story</a>');
}

const serviceCatalogue = document.querySelector('.services-catalogue');
if (serviceCatalogue) {
  const intro = el('section', 'practice-overview', `
    <div class="feedback-heading"><span>Core domains</span><h2>What we solve<span class="blue-stop">.</span></h2></div>
    <div class="practice-overview-grid">
      <a href="${href('practice.html?area=branding')}"><span>Branding</span><h3>Make the brand unmistakable.</h3><p>For organisations that need a clear position and a distinctive visual system.</p><small>Strategy · Visual identity · Visual language</small><strong>Explore the practice <i aria-hidden="true"></i></strong></a>
      <a href="${href('practice.html?area=communication')}"><span>Marketing &amp; communication</span><h3>Make the brand matter in the world.</h3><p>For organisations connecting their brand with audiences, culture and channels.</p><small>MarCom · Analytics · Culture · Sentiment · Sonic · Video · AI</small><strong>Explore the practice <i aria-hidden="true"></i></strong></a>
    </div>`);
  serviceCatalogue.after(el('section', 'method-section', `<div class="feedback-heading"><span>How we work</span><h2>A connected path from question to expression<span class="blue-stop">.</span></h2></div><p class="feedback-intro">A working framework for shaping each engagement. The activities and deliverables are agreed around the brief, not forced into a fixed package.</p><div class="method-grid"><article><b>Discover</b><p>Listen, audit and research the context.</p></article><article><b>Define</b><p>Align purpose, position and strategic priorities.</p></article><article><b>Create</b><p>Build identity, language and experience.</p></article><article><b>Activate</b><p>Bring the brand into channels and touchpoints.</p></article><article><b>Learn</b><p>Review signals, performance and governance.</p></article></div>`));
  serviceCatalogue.querySelector('.service-stream')?.before(intro);
  serviceCatalogue.querySelector('#branding a')?.setAttribute('href', href('practice.html?area=branding'));
  serviceCatalogue.querySelector('#marcom a')?.setAttribute('href', href('practice.html?area=communication'));
  serviceCatalogue.querySelector('#branding a')?.replaceChildren(document.createTextNode('Explore practice'));
  serviceCatalogue.querySelector('#marcom a')?.replaceChildren(document.createTextNode('Explore practice'));
}

const workContent = document.querySelector('.work-catalogue-content');
if (workContent) {
  const filterGroups = el('div', 'work-explore', `<div><span>Explore by practice</span><div class="work-filter-set" data-group="practice"><button type="button" class="active" data-value="all">All practices</button><button type="button" data-value="branding">Branding</button><button type="button" data-value="communication">Marketing &amp; communication</button></div></div><div><span>Explore by challenge</span><div class="work-filter-set" data-group="challenge"><button type="button" class="active" data-value="all">All challenges</button><button type="button" data-value="destination">Destination &amp; place</button><button type="button" data-value="institution">Institutional identity</button><button type="button" data-value="audience">Audience engagement</button></div></div>`);
  workContent.querySelector('.work-directory-head')?.after(filterGroups);
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
  head?.querySelector('span')?.replaceChildren(document.createTextNode('Research · Perspectives · Magazine · Sector insights'));
  head?.insertAdjacentHTML('beforeend', `<p class="approval-note">Reports and news will appear here when approved for publication.</p>`);
  const entries = [...insights.querySelectorAll('.insight-entry')];
  entries.forEach((entry, index) => entry.dataset.topic = ['research', 'magazine', 'perspectives', 'research', 'sector'][index]);
  // The site already has filtering logic; extend its vocabulary without a second competing control.
  requestAnimationFrame(() => {
    const tabs = insights.querySelector('.insight-tabs');
    if (!tabs) return;
    tabs.replaceChildren();
    [['All', 'all'], ['Research', 'research'], ['Perspectives', 'perspectives'], ['Sector insights', 'sector'], ['Magazine', 'magazine']].forEach(([label, topic]) => {
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
  document.querySelector('.case-proof-copy .case-label')?.replaceChildren(document.createTextNode('What BrandShip did'));
  document.querySelector('.case-delivery .case-kicker p')?.replaceChildren(document.createTextNode('From brief to expression'));
  document.querySelector('.case-output .case-label')?.replaceChildren(document.createTextNode('Deliverables'));
  document.querySelector('.case-output')?.querySelectorAll('.case-label')[1]?.replaceChildren(document.createTextNode('Intended strategic value'));
  document.querySelector('.case-output')?.insertAdjacentHTML('afterend', `<div class="case-impact-note"><span>Measured impact</span><p>Approved performance results and client testimonial to be added when available.</p></div>`);
}
