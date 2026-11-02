// Keep direct contact available after the form on phones, without duplicating links.
const direct = document.querySelector('.request-intro .enquiry-direct');
if (direct) {
  const anchor = document.createComment('Direct contact desktop position');
  direct.before(anchor);
  const mobile = matchMedia('(max-width: 800px)');
  const arrange = () => {
    direct.classList.toggle('request-mobile-contact', mobile.matches);
    if (mobile.matches) document.querySelector('.service-request-layout').append(direct);
    else anchor.after(direct);
  };
  mobile.addEventListener('change', arrange);
  arrange();
}

// Keep the active chapter in view within the horizontal phone navigation only.
const chapters = document.querySelector('.about-section-nav');
if (chapters) {
  const keepVisible = () => {
    if (innerWidth > 800) return;
    const active = chapters.querySelector('a[aria-current]');
    if (!active) return;
    const box = chapters.getBoundingClientRect();
    const item = active.getBoundingClientRect();
    if (item.left < box.left + 20 || item.right > box.right - 20) {
      chapters.scrollTo({ left: chapters.scrollLeft + item.left - box.left - 24, behavior: 'instant' });
    }
  };
  new MutationObserver(keepVisible).observe(chapters, { subtree: true, attributes: true, attributeFilter: ['aria-current'] });
}
