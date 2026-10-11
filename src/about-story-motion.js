import './about-story-motion.css';

const pair = document.querySelector('.about-story-pair');
if (pair) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = matchMedia('(max-width: 650px)');
  const overview = pair.querySelector('.about-overview');
  const story = pair.querySelector('.story-section');
  pair.classList.add('connected-story');
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.classList.add('story-connection');
  svg.setAttribute('aria-hidden', 'true');
  svg.innerHTML = '<path class="connection-guide"/><path class="connection-trace" pathLength="1"/><path class="connection-tail" pathLength="1"/><circle class="connection-node" r="3"/><circle class="connection-satellite" r="4"/>';
  pair.append(svg);
  const guide = svg.querySelector('.connection-guide');
  const trace = svg.querySelector('.connection-trace');
  const tail = svg.querySelector('.connection-tail');
  const node = svg.querySelector('.connection-node');
  const satellite = svg.querySelector('.connection-satellite');
  let frame = 0;
  let entered = false;
  function update() {
    frame = 0;
    const bounds = pair.getBoundingClientRect();
    const dot = overview.querySelector('.blue-stop')?.getBoundingClientRect();
    const label = story.querySelector('.chapter-label').getBoundingClientRect();
    if (!dot) return;
    svg.setAttribute('viewBox', `0 0 ${bounds.width} ${bounds.height}`);
    const x = dot.right - bounds.left + 8;
    const y = dot.top - bounds.top + dot.height * .7;
    const endX = label.left - bounds.left - 18;
    const endY = label.top - bounds.top + label.height / 2;
    let path;
    let tailPath;
    if (mobile.matches) {
      const middleY = (overview.getBoundingClientRect().bottom + label.top) / 2 - bounds.top;
      const outerX = bounds.width - 2;
      path = `M${x} ${y} L${outerX - 10} ${y} Q${outerX} ${y} ${outerX} ${y + 10} L${outerX} ${middleY - 10} Q${outerX} ${middleY} ${outerX - 10} ${middleY} L12 ${middleY} Q2 ${middleY} 2 ${middleY + 10} L2 ${endY}`;
      tailPath = `M2 ${endY + 12} L2 ${bounds.height - 12}`;
      node.setAttribute('cx', '2');
      satellite.setAttribute('cx', '2');
    } else {
      const dividerX = (overview.getBoundingClientRect().right + story.getBoundingClientRect().left) / 2 - bounds.left;
      path = `M${x} ${y} L${dividerX - 12} ${y} Q${dividerX} ${y} ${dividerX} ${y - 12} L${dividerX} ${endY + 12} Q${dividerX} ${endY} ${dividerX + 12} ${endY} L${endX} ${endY}`;
      tailPath = `M${dividerX} ${Math.max(y, endY) + 26} L${dividerX} ${bounds.height - 12}`;
      node.setAttribute('cx', String(endX));
      satellite.setAttribute('cx', String(dividerX));
    }
    guide.setAttribute('d', path);
    trace.setAttribute('d', path);
    tail.setAttribute('d', tailPath);
    node.setAttribute('cy', String(endY));
    satellite.setAttribute('cy', String(bounds.height - 12));
    const progress = reduced.matches ? 1 : Math.max(0, Math.min(1, (innerHeight * .9 - bounds.top) / Math.max(1, bounds.height * .7)));
    pair.style.setProperty('--connection-progress', String(progress));
    if (!entered && bounds.top < innerHeight * .85 && bounds.bottom > 0) {
      entered = true;
      pair.classList.add('connection-entered');
    }
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(update); }
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule, { passive: true });
  reduced.addEventListener('change', schedule);
  new ResizeObserver(schedule).observe(pair);
  document.fonts.ready.then(schedule);
  schedule();
}
