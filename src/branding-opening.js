import './branding-opening.css';

export function enhanceBrandingOpening(area = 'branding') {
  const communication = area === 'communication';
  const hero = document.querySelector('.practice-hero');
  const lead = document.querySelector('.practice-lead');
  hero.classList.add('branding-premium-opening');
  if (communication) hero.classList.add('communication-premium-opening');
  lead.classList.add('branding-premium-overview');
  const capabilities = [...document.querySelectorAll('.practice-capabilities article')];
  const links = document.createElement('nav');
  links.className = 'branding-capability-links';
  links.setAttribute('aria-label', communication ? 'Marketing & communication capabilities' : 'Branding capabilities');
  capabilities.forEach((article, index) => {
    article.id = `${area}-capability-${index + 1}`;
    const link = document.createElement('a');
    link.href = `#${article.id}`;
    link.textContent = article.querySelector('h3').textContent;
    links.append(link);
    const mark = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    mark.setAttribute('viewBox', '0 0 48 48');
    mark.setAttribute('aria-hidden', 'true');
    mark.classList.add('branding-capability-mark');
    const icons = communication ? [
      'M8 24h12l18-12v24L20 24M15 24l4 14h8l-5-13',
      'M9 38V10M9 38h30M16 32V24M25 32V17M34 32V10',
      'M24 22a6 6 0 1 0 0-12 6 6 0 0 0 0 12ZM13 38v-4a11 11 0 0 1 22 0v4M8 16v12M40 16v12',
      'M10 10h28v23H25l-9 7v-7h-6ZM17 19h14M17 25h9',
      'M8 20v8M16 13v22M24 7v34M32 13v22M40 20v8',
      'M9 12h30v24H9ZM21 18l9 6-9 6V18Z',
      'M16 16h16v16H16ZM24 7v9M24 32v9M7 24h9M32 24h9M19 20h10v8H19Z'
    ] : ['M8 36 24 8l16 28H8ZM24 19v17M16 30h16','M10 10h28v28H10ZM16 16h16v16H16Z','M8 13h32M8 24h24M8 35h32M37 20v8'];
    mark.innerHTML = `<path d="${icons[index % icons.length]}"/>`;
    article.prepend(mark);
  });
  document.querySelector('.practice-capabilities').classList.add('branding-premium-capabilities');
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(items => items.forEach(item => {
      if (!item.isIntersecting) return;
      item.target.animate([{ opacity: .3, transform: 'translateY(12px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 550, easing: 'cubic-bezier(.2,.7,.2,1)' });
      item.target.classList.add('capability-entered');
      observer.unobserve(item.target);
    }), { threshold: .2 });
    capabilities.forEach(article => observer.observe(article));
  }
  hero.append(links);
  const graphic = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  graphic.classList.add('branding-resolution');
  graphic.setAttribute('viewBox', '0 0 800 120');
  graphic.setAttribute('aria-hidden', 'true');
  graphic.innerHTML = `${Array.from({length:5}, (_,index) => `<path data-strand="${index}"/>`).join('')}<rect x="393" y="53" width="14" height="14"/>`;
  hero.append(graphic);
  const questions = document.querySelector('.practice-questions');
  const explanation = questions.querySelector('h2').textContent;
  questions.classList.add('branding-approach-section');
  const steps = communication ? [
    ['Understand','Explore audiences, culture and communication needs.','Audience & channel insights'],
    ['Align','Connect brand voice with a clear communication direction.','Communication framework'],
    ['Activate','Develop creative concepts across relevant touchpoints.','Campaign & content concepts'],
    ['Learn','Use analytics and sentiment to inform the next steps.','Measurement & learning framework']
  ] : [
    ['Understand','Research the context, audiences and challenge.','Context & audience insights'],
    ['Define','Establish purpose, positioning and personality.','Strategic direction'],
    ['Create','Translate the direction into a coherent identity.','Identity & visual system'],
    ['Apply','Bring the system into real-world touchpoints.','Applications & guidance']
  ];
  questions.innerHTML = `<header class="branding-challenge"><span>What we solve</span><h2>${communication ? 'A clear voice.<br><em>Meaningful connection.</em>' : 'Clear direction.<br><em>Distinctive identity.</em>'}</h2><p>${explanation}</p></header><section class="branding-approach" aria-labelledby="branding-approach-title"><header><span>Our approach</span><h2 id="branding-approach-title">${communication ? 'From audience insight<br>to activation.' : 'From understanding<br>to expression.'}</h2></header><ol class="branding-approach-track">${steps.map(([title,text,output],index)=>`<li><span class="approach-diamond" aria-hidden="true"></span><small>0${index+1} / ${title}</small><h3>${title}</h3><p>${text}</p><span class="approach-output">Illustrative output · ${output}</span></li>`).join('')}</ol><p class="approach-approval">Illustrative approach for review. Phases and outputs depend on the brief and require approval before launch.</p></section>`;
  const approach = questions.querySelector('.branding-approach');
  document.querySelector('.practice-body').classList.add('branding-motion-body');
  const motionSections = [...document.querySelectorAll('.practice-deliverables,.practice-method,.practice-related')];
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const sectionObserver = new IntersectionObserver(items => items.forEach(item => {
      if (!item.isIntersecting) return;
      item.target.classList.add('practice-section-entered');
      const targets = item.target.querySelectorAll('article,.practice-related>div:last-child>a,.feedback-heading, :scope > p');
      targets.forEach((target,index) => target.animate([
        { opacity: .3, transform: `translateY(${item.target.classList.contains('practice-method') ? 6 : 14}px)` },
        { opacity: 1, transform: 'translateY(0)' }
      ], { duration: 550, delay: Math.min(index*65,260), easing:'cubic-bezier(.2,.7,.2,1)' }));
      sectionObserver.unobserve(item.target);
    }), { threshold: .12 });
    motionSections.forEach(section => sectionObserver.observe(section));
  }
  const stages = [...approach.querySelectorAll('li')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let queued = false;
  const clamp = value => Math.max(0, Math.min(1, value));
  function paint() {
    queued = false;
    const box = hero.getBoundingClientRect();
    const progress = reduced.matches ? 1 : clamp(-box.top / Math.max(1,box.height * .65));
    graphic.querySelectorAll('path').forEach((path,index) => {
      const spread = (index - 2) * 21 * (1 - progress);
      const reach = 340 * (1 - progress) + 18;
      path.setAttribute('d', `M${400-reach} ${60+spread} C300 ${60-spread},360 60,400 60 S500 ${60+spread},${400+reach} ${60-spread}`);
    });
    graphic.style.setProperty('--resolution', progress);
    const leadBox = lead.getBoundingClientRect();
    lead.style.setProperty('--overview-reveal', reduced.matches ? 1 : clamp((innerHeight*.95-leadBox.top)/(innerHeight*.35)));
    const approachBox = approach.getBoundingClientRect();
    const approachProgress = reduced.matches ? 1 : clamp((innerHeight*.8-approachBox.top)/(Math.min(innerHeight,approachBox.height)*.85));
    approach.style.setProperty('--approach-progress', approachProgress);
    stages.forEach((stage,index)=> {
      const reveal = reduced.matches ? 1 : clamp(approachProgress*2-index*.22);
      stage.style.setProperty('--stage-reveal', reveal);
      stage.classList.toggle('approach-stage-active', approachProgress >= (index+1)/4);
    });
  }
  const schedule = () => { if(!queued){queued=true;requestAnimationFrame(paint);} };
  addEventListener('scroll', schedule, {passive:true});
  addEventListener('resize', schedule);
  reduced.addEventListener('change', schedule);
  paint();
}
