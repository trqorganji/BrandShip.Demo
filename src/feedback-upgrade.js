// Editorial additions from the website review. Unapproved facts are explicitly labelled.
const base = import.meta.env.BASE_URL;
const href = path => `${base}${path}`;
const el = (tag, className, html) => { const node = document.createElement(tag); node.className = className; node.innerHTML = html; return node; };

const aboutContent = document.querySelector('.about-directory-content');
if (aboutContent) {
  const overview = aboutContent.querySelector('#overview');
  const story = el('section', 'feedback-section story-section', `
    <span class="chapter-label">Our story</span>
    <h2>Built with purpose. Evolving with our clients<span class="blue-stop">.</span></h2>
    <p>BrandShip is an independent Saudi brand consultancy connecting research, strategy, identity and communication. We approach brands as relationships between organisations, people and place.</p>
    <p class="approval-note">The founding date and company milestones will be added after approval.</p>`);
  story.id = 'story';
  if (overview) {
    const pair = el('div', 'about-story-pair', '');
    overview.before(pair);
    pair.append(overview, story);
    pair.after(el('section', 'feedback-section about-history', `
      <div class="feedback-heading"><span>History timeline</span><h2>The BrandShip journey<span class="blue-stop">.</span></h2></div>
      <p class="feedback-intro">An illustrative company journey. The dates and milestones below are sample content for the demo, pending confirmation.</p>
      <div class="story-timeline" aria-label="BrandShip history timeline">
        <article><small>2015 · founding</small><h3>The first chapter</h3><p>Placeholder for how BrandShip began and the problem it set out to solve.</p></article>
        <article><small>2018 · early growth</small><h3>A defining milestone</h3><p>Placeholder for an early project, client or turning point.</p></article>
        <article><small>2021 · expansion</small><h3>More connected capabilities</h3><p>Placeholder for the expansion of the team and consulting practice.</p></article>
        <article><small>2024 · momentum</small><h3>A wider contribution</h3><p>Placeholder for an approved achievement or new market chapter.</p></article>
        <article><small>2026 · today</small><h3>What comes next</h3><p>Placeholder for BrandShip’s current scale, ambition and future focus.</p></article>
      </div>`));
    pair.nextElementSibling.id = 'history';
  }
  const numbers = aboutContent.querySelector('#numbers');
  numbers?.querySelector('header>span')?.replaceChildren(document.createTextNode('Numbers & achievements'));
  numbers?.querySelector('h2')?.replaceChildren(document.createTextNode('Evidence of the practice.'));
  const awards = aboutContent.querySelector('#awards');
  if (numbers && awards) numbers.after(awards);
  const why = el('section', 'feedback-section why-section', `
    <div class="feedback-heading"><span>Why BrandShip</span><h2>Clarity from complexity<span class="blue-stop">.</span></h2></div>
    <p class="feedback-intro">A proposed positioning framework for review. Confirm the language and supporting evidence before using these as company claims.</p>
    <div class="why-grid"><article><b>01</b><h3>Saudi understanding</h3><p>Sample proof point: show how local cultural insight shaped a brief.</p></article><article><b>02</b><h3>Strategic thinking</h3><p>Sample proof point: connect research to a decisive brand position.</p></article><article><b>03</b><h3>Creative execution</h3><p>Sample proof point: demonstrate the idea across identity and touchpoints.</p></article><article><b>04</b><h3>Senior involvement</h3><p>Placeholder for the leadership model and when senior specialists engage.</p></article><article><b>05</b><h3>Stakeholder alignment</h3><p>Placeholder for experience navigating complex stakeholder groups.</p></article></div>`);
  (awards || numbers)?.after(why);
  const leadership = aboutContent.querySelector('#leadership');
  leadership?.querySelector('header>span')?.replaceChildren(document.createTextNode('Leadership'));
  leadership?.querySelector('header')?.insertAdjacentHTML('beforeend', `<p class="feedback-intro">Led by the chairman and founder, with directors across the disciplines that connect brand strategy and execution. Board membership and individual credentials beyond the published roles await confirmation.</p>`);
  const leadershipGrid = leadership?.querySelector('.leadership-grid');
  leadershipGrid?.firstElementChild?.insertAdjacentHTML('beforebegin', '<div class="leadership-group-label">Chairman & founder</div>');
  leadershipGrid?.querySelector('.leadership-owner')?.insertAdjacentHTML('afterend', '<div class="leadership-group-label">Practice leadership</div>');
  leadershipGrid?.querySelectorAll('article').forEach((card, index) => {
    const expertise = index === 0 ? 'Brand vision & consultancy' : ['Business development', 'Marketing communication', 'Project leadership', 'Creative direction', 'Brand strategy'][index - 1];
    (card.querySelector('.owner-copy') || card).insertAdjacentHTML('beforeend', `<p class="leadership-credential"><span>Expertise</span>${expertise}<br><span>Credentials</span>Biography and credentials pending approval</p>`);
  });
  const team = el('section', 'feedback-section about-team', `
    <div class="feedback-heading"><span>Our team</span><h2>Different disciplines. One connected practice<span class="blue-stop">.</span></h2></div>
    <p class="feedback-intro">The work brings together strategy, creative, communication, project management and business development. Meet the publicly listed leadership team now; a wider team directory will follow once names, portraits and credentials are approved.</p>
    <div class="team-disciplines" aria-label="BrandShip disciplines"><span>Strategy</span><span>Creative</span><span>Communication</span><span>Project management</span><span>Business development</span></div>
    <div class="team-preview" aria-label="Wider team profile placeholders"><article><span>Team profile 01</span><h3>Research &amp; insight</h3><p>Name, portrait and short expertise statement to be supplied.</p></article><article><span>Team profile 02</span><h3>Design &amp; experience</h3><p>Name, portrait and short expertise statement to be supplied.</p></article><article><span>Team profile 03</span><h3>Activation &amp; delivery</h3><p>Name, portrait and short expertise statement to be supplied.</p></article></div>
    <a class="feedback-text-link" href="${href('team.html')}">Explore our team <span class="feedback-arrow" aria-hidden="true"></span></a>`);
  team.id = 'team';
  leadership?.after(team);
  const culture = aboutContent.querySelector('.official-culture');
  if (culture) team.after(culture);
  const clients = aboutContent.querySelector('#clients');
  clients?.insertAdjacentHTML('beforeend', `<div class="client-stories"><h3>Selected client stories</h3><p class="approval-note">The short story lines below are editorial placeholders; project links open the current draft case-study layouts.</p><div><a href="${href('case-study.html?project=king-salman-gate')}"><span>Destination identity · story draft</span><strong>King Salman Gate</strong><p>Placeholder: the challenge, shared ambition and role of the brand.</p><em>Explore case</em></a><a href="${href('case-study.html?project=rua-al-haram')}"><span>Place branding · story draft</span><strong>Rua Al Haram</strong><p>Placeholder: the insight that connected place and audience.</p><em>Explore case</em></a><a href="${href('case-study.html?project=masar')}"><span>Destination branding · story draft</span><strong>Masar</strong><p>Placeholder: the strategic direction and how it took shape.</p><em>Explore case</em></a></div><div class="testimonial-placeholder"><span>Client voice · layout placeholder</span><blockquote>“Approved client testimonial will appear here.”</blockquote><p>Client name, role and permission to publish to be confirmed.</p></div></div>`);
  const sectionNav = document.querySelector('.about-section-nav');
  sectionNav?.querySelector('a[href="#overview"]')?.insertAdjacentHTML('afterend', '<a href="#story">Our story</a>');
  sectionNav?.querySelector('a[href="#story"]')?.insertAdjacentHTML('afterend', '<a href="#history">History</a>');
  sectionNav?.querySelector('a[href="#leadership"]')?.insertAdjacentHTML('afterend', '<a href="#team">Team</a>');
}

const teamDirectory = document.querySelector('.team-directory');
if (teamDirectory) {
  teamDirectory.querySelector('.team-grid')?.insertAdjacentHTML('afterend', `<section class="wider-team" aria-labelledby="wider-team-title"><div class="feedback-heading"><span>Wider team</span><h2 id="wider-team-title">The people behind the practice<span class="blue-stop">.</span></h2></div><p class="feedback-intro">Sample profile layout for the broader team. Replace each card with an approved name, portrait, role and credential.</p><div class="wider-team-grid"><article><div class="profile-placeholder" aria-hidden="true"><span>01</span></div><h3>Team member</h3><p>Strategy &amp; research · profile pending</p></article><article><div class="profile-placeholder" aria-hidden="true"><span>02</span></div><h3>Team member</h3><p>Creative &amp; design · profile pending</p></article><article><div class="profile-placeholder" aria-hidden="true"><span>03</span></div><h3>Team member</h3><p>Communication &amp; activation · profile pending</p></article></div></section>`);
}

const serviceCatalogue = document.querySelector('.services-catalogue');
if (serviceCatalogue) {
  const intro = el('section', 'practice-overview', `
    <div class="feedback-heading"><span>Core domains</span><h2>What we solve<span class="blue-stop">.</span></h2></div>
    <div class="practice-overview-grid">
      <a href="${href('practice.html?area=branding')}"><span>Branding</span><h3>Make the brand unmistakable.</h3><p>For organisations that need a clear position and a distinctive visual system.</p><dl><dt>What we solve</dt><dd>Positioning and identity challenges</dd><dt>Illustrative deliverables</dt><dd>Strategic blueprint, identity system, visual language</dd><dt>Selected cases</dt><dd>King Salman Gate · Rua Al Haram</dd></dl><strong>Explore the practice <i aria-hidden="true"></i></strong></a>
      <a href="${href('practice.html?area=communication')}"><span>Marketing &amp; communication</span><h3>Make the brand matter in the world.</h3><p>For organisations connecting their brand with audiences, culture and channels.</p><dl><dt>What we solve</dt><dd>Audience connection and activation</dd><dt>Illustrative deliverables</dt><dd>Communication strategy, content concepts, measurement plan</dd><dt>Selected cases</dt><dd>Madina Made · King Salman Park</dd></dl><strong>Explore the practice <i aria-hidden="true"></i></strong></a>
    </div>`);
  serviceCatalogue.after(el('section', 'method-section', `<div class="feedback-heading"><span>How we work</span><h2>From question to enduring expression<span class="blue-stop">.</span></h2></div><p class="feedback-intro">Illustrative consulting framework for review. Every phase can be adapted to the engagement and the actual BrandShip methodology should be approved before launch.</p><div class="method-grid"><article><small>01 / Discover</small><b>Listen &amp; research</b><p>Understand audiences, context and the brief.</p><em>Sample output · discovery summary</em></article><article><small>02 / Define</small><b>Set direction</b><p>Align purpose, position and strategic priorities.</p><em>Sample output · strategic blueprint</em></article><article><small>03 / Create</small><b>Build the system</b><p>Express the idea through identity, voice and experience.</p><em>Sample output · creative platform</em></article><article><small>04 / Activate</small><b>Bring it to life</b><p>Plan channels, launch and stakeholder touchpoints.</p><em>Sample output · activation plan</em></article><article><small>05 / Measure</small><b>Govern &amp; learn</b><p>Review signals and maintain consistency.</p><em>Sample output · measurement framework</em></article></div>`));
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
  stream?.insertAdjacentHTML('beforeend', `<article class="insight-entry insight-placeholder" data-topic="reports"><span>Report · sample content</span><h2>Brand signals in a changing market</h2><p>Placeholder for a future downloadable report. Research, date and findings pending approval.</p></article><article class="insight-entry insight-placeholder" data-topic="news"><span>News · sample content</span><h2>A new chapter in the BrandShip story</h2><p>Placeholder for a verified company announcement, with date and supporting details.</p></article>`);
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
  document.querySelector('.case-proof-copy .case-label')?.replaceChildren(document.createTextNode('What BrandShip did'));
  document.querySelector('.case-delivery .case-kicker p')?.replaceChildren(document.createTextNode('From brief to expression'));
  document.querySelector('.case-output .case-label')?.replaceChildren(document.createTextNode('Deliverables'));
  document.querySelector('.case-output')?.querySelectorAll('.case-label')[1]?.replaceChildren(document.createTextNode('Intended strategic value'));
  document.querySelector('.case-output')?.insertAdjacentHTML('afterend', `<div class="case-impact-note"><span>Measured impact</span><p>Approved performance results and client testimonial to be added when available.</p></div>`);
  document.querySelector('.case-impact-note')?.insertAdjacentHTML('beforeend', '<div class="case-impact-sample"><strong>35%</strong><small>Illustrative result for the demo — replace with a verified measure and its source.</small></div>');
  caseOverview.insertAdjacentHTML('afterbegin', '<p class="case-draft-label">Illustrative case-story structure · copy and results pending client approval</p>');
}
