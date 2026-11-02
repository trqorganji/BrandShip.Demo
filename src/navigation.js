// One modal controller for navigation and search, including touch and keyboard use.
export function initNavigation({ menu, menuBtn, navActions, searchIndex }) {
  if (!menu || !menuBtn) return;
  menu.id = 'primary-menu';
  menu.setAttribute('role', 'dialog');
  menu.setAttribute('aria-label', 'Explore Brandship');
  menuBtn.setAttribute('aria-controls', menu.id);
  menu.inert = true;
  const caption = document.createElement('p');
  caption.className = 'menu-caption';
  caption.textContent = 'Explore Brandship';
  menu.prepend(caption);
  const dismiss = document.createElement('button');
  dismiss.type = 'button';
  dismiss.className = 'menu-dismiss';
  dismiss.textContent = 'Close navigation';
  caption.after(dismiss);
  const contactLink = menu.querySelector('a[href*="contact.html"]');
  if (contactLink) {
    contactLink.classList.add('menu-project-link');
    contactLink.textContent = 'Request a service';
  }
  const contact = document.createElement('a');
  contact.className = 'menu-email';
  contact.href = 'mailto:hello@ourbrandship.com';
  contact.textContent = 'hello@ourbrandship.com';
  menu.append(contact);

  let active = null;
  let trigger = null;
  let savedScroll = 0;
  let savedBody;
  const inertState = new Map();
  const focusable = panel => [...panel.querySelectorAll('a[href],button:not(:disabled),input:not(:disabled),[tabindex="0"]')]
    .filter(element => !element.inert && element.getClientRects().length);

  function close(restoreFocus = true) {
    if (!active) return;
    active.classList.remove('open');
    active.setAttribute('aria-hidden', 'true');
    active.removeAttribute('aria-modal');
    active.inert = true;
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('aria-label', 'Open navigation');
    inertState.forEach((value, element) => { element.inert = value; });
    inertState.clear();
    Object.assign(document.body.style, savedBody);
    const scrollBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'auto';
    scrollTo({ top: savedScroll, behavior: 'instant' });
    document.documentElement.style.scrollBehavior = scrollBehavior;
    document.documentElement.classList.remove('has-overlay');
    active = null;
    if (restoreFocus) trigger?.focus({ preventScroll: true });
  }
  function open(panel, button, first) {
    close(false);
    savedScroll = scrollY;
    savedBody = Object.fromEntries(['position', 'top', 'width', 'overflow'].map(key => [key, document.body.style[key]]));
    Object.assign(document.body.style, { position: 'fixed', top: `${-savedScroll}px`, width: '100%', overflow: 'hidden' });
    document.documentElement.classList.add('has-overlay');
    document.querySelectorAll('main,footer,.skip,.nav .brand,.desktop-nav,.nav-actions>*').forEach(element => {
      if (element === button) return;
      inertState.set(element, element.inert);
      element.inert = true;
    });
    active = panel;
    trigger = button;
    panel.inert = false;
    panel.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
    panel.setAttribute('aria-modal', 'true');
    if (panel === menu) {
      menuBtn.setAttribute('aria-expanded', 'true');
      menuBtn.setAttribute('aria-label', 'Close navigation');
    }
    // Wait for the hidden panel's visibility style to update before moving focus.
    requestAnimationFrame(() => {
      if (active === panel) (first || focusable(panel)[0])?.focus({ preventScroll: true });
    });
  }
  dismiss.addEventListener('click', () => close());
  menuBtn.addEventListener('click', () => active === menu ? close() : open(menu, menuBtn, menu.querySelector('nav a')));
  menu.addEventListener('click', event => {
    if (event.target.closest('a')) close(false);
    else if (event.target === menu) close();
  });
  document.addEventListener('keydown', event => {
    if (!active) return;
    if (event.key === 'Escape') { event.preventDefault(); close(); return; }
    if (event.key !== 'Tab') return;
    const items = active === menu ? [menuBtn, ...focusable(menu)] : focusable(active);
    const index = items.indexOf(document.activeElement);
    if (index < 0 || (!event.shiftKey && index === items.length - 1) || (event.shiftKey && index === 0)) {
      event.preventDefault();
      items[event.shiftKey ? items.length - 1 : 0]?.focus({ preventScroll: true });
    }
  });
  matchMedia('(min-width: 1201px)').addEventListener('change', event => {
    if (event.matches && active === menu) close(false);
  });
  addEventListener('pagehide', () => close(false));

  if (!navActions) return;
  const searchButton = document.createElement('button');
  searchButton.type = 'button';
  searchButton.className = 'search-toggle nav-icon-button';
  searchButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"></circle><path d="m16 16 4 4"></path></svg>';
  searchButton.setAttribute('aria-label', 'Search Brandship');
  navActions.prepend(searchButton);
  const search = document.createElement('div');
  search.className = 'site-search';
  search.setAttribute('role', 'dialog');
  search.setAttribute('aria-label', 'Search Brandship');
  search.setAttribute('aria-hidden', 'true');
  search.inert = true;
  search.innerHTML = '<button type="button" aria-label="Close search">×</button><label for="site-search-input">Search Brandship</label><input id="site-search-input" type="search" autocomplete="off" placeholder="What are you looking for?"><div class="search-results" aria-live="polite"></div>';
  document.body.append(search);
  const input = search.querySelector('input');
  const results = search.querySelector('.search-results');
  function render() {
    const term = input.value.toLowerCase().trim();
    const matches = searchIndex.filter(item => !term || item.join(' ').toLowerCase().includes(term));
    results.replaceChildren(...matches.map(([title, href, description]) => {
      const link = document.createElement('a');
      link.href = href;
      const strong = document.createElement('strong');
      strong.textContent = title;
      const span = document.createElement('span');
      span.textContent = description;
      link.append(strong, span);
      return link;
    }));
    if (!matches.length) results.textContent = 'No matches. Try a service or page name.';
  }
  searchButton.addEventListener('click', () => { render(); open(search, searchButton, input); });
  search.querySelector('button').addEventListener('click', () => close());
  search.addEventListener('click', event => { if (event.target.closest('a')) close(false); });
  input.addEventListener('input', render);
}
