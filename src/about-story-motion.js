import './about-story-motion.css';

const pair = document.querySelector('.about-story-pair');
if (pair) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = matchMedia('(max-width: 650px)');
  const compact = matchMedia('(max-width: 800px)');
  const overview = pair.querySelector('.about-overview');
  const story = pair.querySelector('.story-section');
  const scene = pair.nextElementSibling?.matches('.cinematic-stage') ? pair.nextElementSibling : null;
  const screen = scene?.querySelector('.cinematic-sticky');
  const clamp = value => Math.max(0, Math.min(1, value));
  const ns = 'http://www.w3.org/2000/svg';
  pair.classList.add('connected-story');
  const svg = document.createElementNS(ns, 'svg');
  svg.classList.add('story-connection');
  svg.setAttribute('aria-hidden', 'true');
  svg.innerHTML = '<path class="connection-guide"/><path class="connection-tail-guide"/><path class="connection-trace" pathLength="1"/><path class="connection-tail" pathLength="1"/><circle class="connection-node" r="5"/><circle class="connection-satellite" r="6"/><circle class="connection-head-halo" r="9"/><circle class="connection-head" r="4"/>';
  pair.append(svg);
  const guide = svg.querySelector('.connection-guide');
  const trace = svg.querySelector('.connection-trace');
  const tailGuide = svg.querySelector('.connection-tail-guide');
  const tail = svg.querySelector('.connection-tail');
  const node = svg.querySelector('.connection-node');
  const satellite = svg.querySelector('.connection-satellite');
  let continuation;
  if (screen) {
    scene.classList.add('story-connected-scene');
    continuation = document.createElementNS(ns, 'svg');
    continuation.classList.add('story-connection', 'story-continuation');
    continuation.setAttribute('aria-hidden', 'true');
    continuation.innerHTML = '<path class="connection-guide"/><path class="connection-trace" pathLength="1"/><circle class="connection-head-halo" r="10"/><circle class="connection-head" r="5"/>';
    screen.append(continuation);
  }
  const continuationGuide = continuation?.querySelector('.connection-guide');
  const continuationTrace = continuation?.querySelector('.connection-trace');
  const lengths = new WeakMap();
  let frame = 0;
  let lastTime = 0;
  let needsMeasure = true;
  let geometryDirty = true;
  let active = false;
  let entered = false;
  let target = 0;
  let progress = 0;
  let sceneTarget = 0;
  let sceneProgress = 0;
  let screenWidth = 0;
  let screenHeight = 0;
  let handoffRatio = .5;
  let sceneVisible = false;
  let sourceY = 0;
  function setPath(path, d) {
    if (path.getAttribute('d') === d) return;
    path.setAttribute('d', d);
    lengths.delete(path);
  }
  function moveHead(host, path, amount) {
    if (!lengths.has(path)) lengths.set(path, path.getTotalLength());
    const point = path.getPointAtLength(lengths.get(path) * clamp(amount));
    host.querySelectorAll('.connection-head,.connection-head-halo').forEach(circle => {
      circle.setAttribute('cx', String(point.x));
      circle.setAttribute('cy', String(point.y));
      circle.style.opacity = reduced.matches || amount <= 0 || amount >= 1 ? '0' : '1';
    });
  }
  function measureGeometry(bounds) {
    const dot = overview.querySelector('.blue-stop')?.getBoundingClientRect();
    const label = story.querySelector('.chapter-label').getBoundingClientRect();
    if (!dot) return;
    svg.setAttribute('viewBox', `0 0 ${bounds.width} ${bounds.height}`);
    const x = dot.right - bounds.left + 8;
    const y = dot.top - bounds.top + dot.height * .7;
    sourceY = y;
    const endX = label.left - bounds.left - 18;
    const endY = label.top - bounds.top + label.height / 2;
    let path;
    let tailPath;
    if (mobile.matches) {
      const middleY = (overview.getBoundingClientRect().bottom + label.top) / 2 - bounds.top;
      const outerX = bounds.width - 8;
      path = `M${x} ${y} L${outerX - 10} ${y} Q${outerX} ${y} ${outerX} ${y + 10} L${outerX} ${middleY - 10} Q${outerX} ${middleY} ${outerX - 10} ${middleY} L18 ${middleY} Q8 ${middleY} 8 ${middleY + 10} L8 ${endY}`;
      tailPath = `M8 ${endY} V${bounds.height - 32} Q8 ${bounds.height - 16} 24 ${bounds.height - 16} H${bounds.width / 2 - 16} Q${bounds.width / 2} ${bounds.height - 16} ${bounds.width / 2} ${bounds.height}`;
      node.setAttribute('cx', '8');
    } else {
      const dividerX = (overview.getBoundingClientRect().right + story.getBoundingClientRect().left) / 2 - bounds.left;
      path = `M${x} ${y} L${dividerX - 12} ${y} Q${dividerX} ${y} ${dividerX} ${y - 12} L${dividerX} ${endY + 12} Q${dividerX} ${endY} ${dividerX + 12} ${endY} L${endX} ${endY}`;
      const turnY = bounds.height - 32;
      const joinX = bounds.width / 2;
      tailPath = `M${endX} ${endY} V${turnY} Q${endX} ${turnY + 16} ${endX - 16} ${turnY + 16} H${joinX + 16} Q${joinX} ${turnY + 16} ${joinX} ${bounds.height}`;
      node.setAttribute('cx', String(endX));
    }
    setPath(guide, path);
    setPath(trace, path);
    setPath(tailGuide, tailPath);
    setPath(tail, tailPath);
    node.setAttribute('cy', String(endY));
    satellite.setAttribute('cx', String(bounds.width / 2));
    satellite.setAttribute('cy', String(bounds.height));
    if (screen) {
      const sceneBounds = screen.getBoundingClientRect();
      screenWidth = sceneBounds.width;
      screenHeight = sceneBounds.height;
      handoffRatio = (bounds.left + bounds.width / 2 - sceneBounds.left) / screenWidth;
      continuation.setAttribute('viewBox', `0 0 ${screenWidth} ${screenHeight}`);
    }
    geometryDirty = false;
  }
  function measure() {
    const bounds = pair.getBoundingClientRect();
    if (geometryDirty) measureGeometry(bounds);
    // Keep the extended scroll range, with responsive easing for a smooth handoff.
    target = reduced.matches ? 1 : clamp((innerHeight * .8 - bounds.top - sourceY) / Math.max(400, bounds.height * (mobile.matches ? 1.15 : 1.6)));
    if (scene) {
      const next = scene.getBoundingClientRect();
      sceneVisible = next.bottom > 0 && next.top < innerHeight;
      sceneTarget = reduced.matches ? 1 : clamp((innerHeight * .8 - next.top) / Math.max(innerHeight, (next.height - innerHeight) * .75));
    }
    if (!entered && bounds.top < innerHeight * .85 && bounds.bottom > 0) {
      entered = true;
      pair.classList.add('connection-entered');
    }
    needsMeasure = false;
  }
  function drawContinuation() {
    if (!continuation) return;
    const staticView = reduced.matches || compact.matches;
    const insetX = staticView ? 0 : parseFloat(scene.style.getPropertyValue('--portal-inset-x') || '29') / 100;
    const insetY = staticView ? 0 : parseFloat(scene.style.getPropertyValue('--portal-inset-y') || '23') / 100;
    const startX = screenWidth * handoffRatio;
    const left = Math.max(12, screenWidth * insetX - 14);
    const top = Math.max(28, screenHeight * insetY - 14);
    const bottom = Math.min(screenHeight - 18, screenHeight * (1 - insetY) + 14);
    const d = `M${startX} 0 V${top - 14} Q${startX} ${top} ${startX - 14} ${top} H${left + 14} Q${left} ${top} ${left} ${top + 14} V${bottom - 14} Q${left} ${bottom} ${left + 14} ${bottom} H${Math.min(screenWidth - 12, left + 90)}`;
    setPath(continuationGuide, d);
    setPath(continuationTrace, d);
    continuation.style.setProperty('--connection-progress', sceneProgress.toFixed(4));
    moveHead(continuation, continuationTrace, sceneProgress);
  }
  function render(now) {
    frame = 0;
    if (document.hidden) { lastTime = 0; return; }
    if (needsMeasure) measure();
    const elapsed = lastTime ? Math.min(64, now - lastTime) : 16;
    lastTime = now;
    const smoothing = 1 - Math.exp(-elapsed / 320);
    progress = reduced.matches ? 1 : progress + (target - progress) * smoothing;
    if (Math.abs(target - progress) < .0005) progress = target;
    const onward = progress >= .99 ? sceneTarget : 0;
    sceneProgress = reduced.matches ? 1 : sceneProgress + (onward - sceneProgress) * smoothing;
    if (Math.abs(onward - sceneProgress) < .0005) sceneProgress = onward;
    const mainProgress = clamp(progress / .55);
    const tailProgress = clamp((progress - .55) / .45);
    pair.style.setProperty('--connection-progress', mainProgress.toFixed(4));
    pair.style.setProperty('--connection-tail-progress', tailProgress.toFixed(4));
    moveHead(svg, mainProgress < 1 ? trace : tail, mainProgress < 1 ? mainProgress : tailProgress);
    if (sceneVisible || reduced.matches) drawContinuation();
    const settling = Math.abs(target - progress) > .0005 || Math.abs(onward - sceneProgress) > .0005;
    if (settling && active) frame = requestAnimationFrame(render);
    else lastTime = 0;
  }
  function schedule() {
    needsMeasure = true;
    if (!frame && !document.hidden) frame = requestAnimationFrame(render);
  }
  function resize() { geometryDirty = true; schedule(); }
  const inView = new Set();
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.isIntersecting ? inView.add(entry.target) : inView.delete(entry.target));
    active = inView.size > 0;
    if (active) schedule();
    else { cancelAnimationFrame(frame); frame = 0; lastTime = 0; }
  }, { rootMargin: '120px' });
  observer.observe(pair);
  if (scene) observer.observe(scene);
  addEventListener('scroll', () => { if (active) schedule(); }, { passive: true });
  addEventListener('resize', resize, { passive: true });
  addEventListener('pageshow', resize);
  pair.addEventListener('animationend', resize);
  reduced.addEventListener('change', resize);
  compact.addEventListener('change', resize);
  mobile.addEventListener('change', resize);
  const sizes = new ResizeObserver(resize);
  sizes.observe(pair);
  if (screen) sizes.observe(screen);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(frame); frame = 0; lastTime = 0; }
    else resize();
  });
  document.fonts.ready.then(resize);
  schedule();
}
