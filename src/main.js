const playCinematicIntro=()=>{
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let seen=false;try{seen=sessionStorage.getItem('brandship-intro-seen')==='1'}catch{}
  if(seen||reduced){document.documentElement.classList.remove('intro-pending');return}
  const intro=document.createElement('div');intro.className='cinematic-intro';intro.setAttribute('role','dialog');intro.setAttribute('aria-label','BrandShip introduction');intro.innerHTML='<video muted playsinline preload="auto" aria-hidden="true"><source src="/assets/brandship-knight.mp4" type="video/mp4"></video><div class="cinematic-intro__shade"></div><div class="cinematic-intro__brand"><img src="/assets/brandship-logo.png" alt="BrandShip"><p>Building Iconic Saudi Brands</p></div><div class="cinematic-intro__status"><span>BrandShip</span><div><i></i></div><b>00</b></div><button type="button">Skip intro</button><div class="cinematic-intro__curtain"></div>';
  document.body.prepend(intro);document.body.classList.add('intro-lock');document.documentElement.classList.remove('intro-pending');
  const film=intro.querySelector('video');const progress=intro.querySelector('.cinematic-intro__status i');const counter=intro.querySelector('.cinematic-intro__status b');let finished=false;let minimumElapsed=false;let videoEnded=false;
  const finish=()=>{if(finished)return;finished=true;try{sessionStorage.setItem('brandship-intro-seen','1')}catch{}intro.classList.add('is-leaving');document.body.classList.remove('intro-lock');setTimeout(()=>intro.remove(),1100)};
  const maybeFinish=()=>{if(minimumElapsed&&videoEnded)finish()};
  setTimeout(()=>{minimumElapsed=true;maybeFinish()},1100);setTimeout(finish,4200);
  film.addEventListener('canplay',()=>{intro.classList.add('is-playing');film.play().catch(()=>{videoEnded=true;maybeFinish()})},{once:true});
  film.addEventListener('timeupdate',()=>{if(!film.duration)return;const value=Math.min(100,Math.round(film.currentTime/film.duration*100));progress.style.transform=`scaleX(${value/100})`;counter.textContent=String(value).padStart(2,'0')});
  film.addEventListener('ended',()=>{videoEnded=true;progress.style.transform='scaleX(1)';counter.textContent='100';maybeFinish()});film.addEventListener('error',()=>{videoEnded=true;maybeFinish()},{once:true});intro.querySelector('button').addEventListener('click',finish);
};
// The homepage hero is the cinematic introduction; never gate content behind a second video.
document.documentElement.classList.remove('intro-pending');
const nav=document.querySelector('.nav');const menuBtn=document.querySelector('.menu-btn');const menu=document.querySelector('.menu');
const sitemapRoutes={'About':'/about.html','Services':'/services.html','Our work':'/work.html','Insights':'/insights.html','Careers':'/careers.html','Contact':'/contact.html'};
const isHomepage=location.pathname==='/'||location.pathname.endsWith('/index.html');
document.querySelectorAll('.desktop-nav a,.menu a,footer a').forEach(link=>{const label=link.textContent.replace(/\d+/g,'').trim();if(sitemapRoutes[label])link.href=sitemapRoutes[label]});
addEventListener('scroll',()=>nav.classList.toggle('scrolled',scrollY>30),{passive:true});
if(nav&&matchMedia('(pointer:fine)').matches){nav.addEventListener('pointermove',event=>{const rect=nav.getBoundingClientRect();nav.style.setProperty('--nav-x',`${event.clientX-rect.left}px`);nav.style.setProperty('--nav-y',`${event.clientY-rect.top}px`)},{passive:true});nav.addEventListener('pointerleave',()=>{nav.style.setProperty('--nav-x','50%');nav.style.setProperty('--nav-y','0%')},{passive:true})}
menuBtn.addEventListener('click',()=>{const open=menu.classList.toggle('open');menuBtn.setAttribute('aria-expanded',open);menu.setAttribute('aria-hidden',!open)});
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.classList.remove('open');menuBtn.setAttribute('aria-expanded','false');menu.setAttribute('aria-hidden','true')}));
document.querySelectorAll('.service button').forEach(button=>button.addEventListener('click',()=>{const card=button.closest('.service');document.querySelectorAll('.service').forEach(s=>{if(s!==card){s.classList.remove('open');s.querySelector('i').textContent='+'}});card.classList.toggle('open');button.querySelector('i').textContent=card.classList.contains('open')?'−':'+'}));
document.querySelector('#to-top').addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));
const reveal=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('revealed')}),{threshold:.12});
document.querySelectorAll('.project,.service,.insight-grid article,.stats div').forEach(el=>reveal.observe(el));
const normalizedPath=path=>path.replace(/\/index\.html$/,'/').replace(/\/$/,'')||'/';
const currentPath=normalizedPath(location.pathname);document.querySelectorAll('.desktop-nav a,.menu nav a').forEach(link=>{const target=new URL(link.href,location.href);if(normalizedPath(target.pathname)===currentPath)link.setAttribute('aria-current','page')});
const searchIndex=[['About','/about.html','Overview, achievements, mission, vision, awards, leadership and clients'],['Services','/services.html','Branding and marketing communication strategy and execution'],['Our work','/work.html','Portfolio, sectors and case studies'],['Insights','/insights.html','Research, magazine and news'],['Careers','/careers.html','Culture, life at BrandShip and open positions'],['Contact','/contact.html','Get in touch']];
const navActions=document.querySelector('.nav-actions');
if(navActions){const searchButton=document.createElement('button');searchButton.className='search-toggle nav-icon-button';searchButton.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"></circle><path d="m16 16 4 4"></path></svg>';searchButton.setAttribute('aria-label','Search BrandShip');searchButton.setAttribute('title','Search');navActions.prepend(searchButton);const search=document.createElement('div');search.className='site-search';search.setAttribute('aria-hidden','true');search.innerHTML='<button aria-label="Close search">×</button><label for="site-search-input">Search BrandShip</label><input id="site-search-input" type="search" autocomplete="off" placeholder="What are you looking for?"><div class="search-results"></div>';document.body.append(search);const input=search.querySelector('input');const results=search.querySelector('.search-results');const render=value=>{const term=value.toLowerCase().trim();results.innerHTML=searchIndex.filter(item=>!term||item.join(' ').toLowerCase().includes(term)).map(item=>`<a href="${item[1]}"><strong>${item[0]}</strong><span>${item[2]}</span></a>`).join('')};searchButton.addEventListener('click',()=>{search.classList.add('open');search.setAttribute('aria-hidden','false');render('');setTimeout(()=>input.focus(),50)});search.querySelector('button').addEventListener('click',()=>{search.classList.remove('open');search.setAttribute('aria-hidden','true')});input.addEventListener('input',()=>render(input.value));addEventListener('keydown',event=>{if(event.key==='Escape')search.querySelector('button').click()})}
document.querySelectorAll('.lang').forEach(button=>{button.textContent='EN';button.disabled=true;button.setAttribute('aria-label','English. Arabic translation is not yet available.');button.title='Arabic translation is not yet available';});
const topLevelPage=document.body.matches('.page-shell,.work-archive,.insights-page');
if(topLevelPage&&!matchMedia('(prefers-reduced-motion: reduce)').matches){document.body.classList.add('motion-ready');const motionItems=[...document.querySelectorAll('.page-hero>* ,.archive-hero>* ,.insights-hero>* ,.page-section-head>* ,.page-card,.page-list article,.client-cloud span,.archive-card,.insight-feature>*,.insight-card,.services-map-heading>*,.service-map-card,.practice-head>*,.practice-flow,.practice-content article,.services-close>*,.services-catalogue-title>span,.services-catalogue-title>p,.service-stream-group,.service-stream article,.insights-catalogue-title>p,.insights-directory-head>*,.insight-entry,.careers-catalogue-title>p,.career-section-head,.career-culture-stage>div,.career-culture-stage>p,.career-position-intro>*,.career-role,.about-page-hero>*,.about-overview>*,.about-numbers header>*,.about-stat-grid article,.about-purpose>span,.about-purpose article,.about-awards header>*,.about-awards article,.about-leadership header>*,.leadership-grid article,.about-clients header>*,.client-wall span')];motionItems.forEach((item,index)=>{item.classList.add('motion-reveal');item.dataset.delay=String(index%4)});const motionObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');motionObserver.unobserve(entry.target)}}),{threshold:.1,rootMargin:'0px 0px -5%'});motionItems.forEach(item=>motionObserver.observe(item))}
const video=document.querySelector('.hero-video');if(video)fetch('/assets/brandship-knight.mp4',{method:'HEAD'}).then(r=>{if(r.ok){video.src='/assets/brandship-knight.mp4';video.addEventListener('canplay',()=>{video.classList.add('ready');document.querySelector('.hero')?.classList.add('video-ready')},{once:true})}}).catch(()=>{});

// Lightweight cinematic hero motion: cursor parallax and scroll depth.
const hero=document.querySelector('.hero');
const canAnimate=!matchMedia('(prefers-reduced-motion: reduce)').matches;
if(hero&&canAnimate){
  let targetX=0,targetY=0,currentX=0,currentY=0,raf;
  const render=()=>{
    currentX+=(targetX-currentX)*.055;currentY+=(targetY-currentY)*.055;
    hero.style.setProperty('--mx',currentX.toFixed(2));hero.style.setProperty('--my',currentY.toFixed(2));
    raf=requestAnimationFrame(render);
  };
  if(matchMedia('(pointer:fine)').matches){
    hero.addEventListener('pointermove',e=>{targetX=(e.clientX/innerWidth-.5)*2;targetY=(e.clientY/innerHeight-.5)*2},{passive:true});
    hero.addEventListener('pointerleave',()=>{targetX=0;targetY=0},{passive:true});
    render();
  }
  let ticking=false;
  addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(()=>{const progress=Math.min(1,scrollY/Math.max(hero.offsetHeight,1));hero.style.setProperty('--scroll',progress.toFixed(3));ticking=false});ticking=true}},{passive:true});
  addEventListener('pagehide',()=>cancelAnimationFrame(raf),{once:true});
}

const brandCursor=document.querySelector('.brand-cursor');
if(brandCursor&&matchMedia('(pointer:fine)').matches){
  addEventListener('pointermove',e=>{brandCursor.style.left=`${e.clientX}px`;brandCursor.style.top=`${e.clientY}px`;brandCursor.classList.add('visible')},{passive:true});
  document.querySelectorAll('a,button').forEach(el=>{el.addEventListener('pointerenter',()=>brandCursor.classList.add('active'));el.addEventListener('pointerleave',()=>brandCursor.classList.remove('active'))});
  document.documentElement.addEventListener('mouseleave',()=>brandCursor.classList.remove('visible'));
}

// Branded transitions between internal pages. Same-page anchors keep native smooth scrolling.
const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
if(false){
  const transition=document.createElement('div');
  transition.className='page-transition';
  transition.setAttribute('aria-hidden','true');
  transition.innerHTML='<img class="page-transition__mark" src="/assets/brandship-logo.png" alt="">';
  document.body.appendChild(transition);
  const projectArrival=sessionStorage.getItem('brandship-project-flight')==='1';
  sessionStorage.removeItem('brandship-project-flight');
  if(!projectArrival)requestAnimationFrame(()=>{transition.classList.add('is-entering');setTimeout(()=>transition.classList.remove('is-entering'),900)});
  document.addEventListener('click',event=>{
    const link=event.target.closest('a[href]');
    if(!link||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||link.target==='_blank'||link.hasAttribute('download'))return;
    const href=link.getAttribute('href');
    if(!href||href.startsWith('#')||href.startsWith('mailto:')||href.startsWith('tel:'))return;
    const target=new URL(link.href,location.href);
    if(target.origin!==location.origin)return;
    if(target.pathname===location.pathname&&target.search===location.search)return;
    event.preventDefault();
    transition.classList.remove('is-entering');transition.classList.add('is-leaving');
    setTimeout(()=>location.assign(target.href),720);
  });
  addEventListener('pageshow',event=>{if(event.persisted){transition.classList.remove('is-leaving');transition.classList.add('is-entering');setTimeout(()=>transition.classList.remove('is-entering'),900)}});
}

// Project cards transition through their own artwork into the case-study hero.
if(false){
  document.addEventListener('click',event=>{
    const link=event.target.closest('a.project-link[href]');
    if(!link||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
    const target=new URL(link.href,location.href);
    if(target.origin!==location.origin)return;
    let source=link.querySelector('img');
    const synthetic=!source&&link.dataset.transitionImage;
    if(synthetic){source=document.createElement('img');source.src=link.dataset.transitionImage;source.alt=link.querySelector('strong,h2,h3')?.textContent.trim()||'Selected work'}
    if(!source)return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const rect=synthetic?link.getBoundingClientRect():source.getBoundingClientRect();
    const flight=source.cloneNode(true);
    flight.removeAttribute('loading');
    flight.className='project-flight';
    Object.assign(flight.style,{left:`${rect.left}px`,top:`${rect.top}px`,width:`${rect.width}px`,height:`${rect.height}px`});
    const title=link.querySelector('h2,h3')?.textContent.trim()||source.alt||'Selected work';
    const label=document.createElement('div');
    label.className='project-flight-label';
    label.innerHTML=`<span>Selected work</span><strong>${title}</strong>`;
    document.body.append(flight,label);
    document.body.classList.add('project-is-opening');
    sessionStorage.setItem('brandship-project-flight','1');
    flight.getBoundingClientRect();
    requestAnimationFrame(()=>{flight.classList.add('full');label.classList.add('show')});
    setTimeout(()=>location.assign(target.href),780);
  },true);
}

const workCarousel=document.querySelector('.preview-gallery');
if(workCarousel){
  const track=workCarousel.querySelector('.preview-track');
  const slides=[...track.querySelectorAll('a')];
  const progress=workCarousel.querySelector('.preview-progress i');
  let active=0,timer;
  const show=index=>{
    active=(index+slides.length)%slides.length;
    const step=slides[0].getBoundingClientRect().width+(parseFloat(getComputedStyle(track).gap)||0);
    track.style.transform=`translate3d(${-active*step}px,0,0)`;
    slides.forEach((slide,i)=>{slide.classList.toggle('is-active',i===active);if(i===active)slide.setAttribute('aria-current','true');else slide.removeAttribute('aria-current')});
    progress.style.transform=`scaleX(${(active+1)/slides.length})`;
  };
  const start=()=>{if(reduceMotion)return;clearInterval(timer);timer=setInterval(()=>show(active+1),3600)};
  show(0);start();
  workCarousel.addEventListener('pointerenter',()=>clearInterval(timer));
  workCarousel.addEventListener('pointerleave',start);
  workCarousel.addEventListener('focusin',()=>clearInterval(timer));
  workCarousel.addEventListener('focusout',start);
  addEventListener('resize',()=>show(active),{passive:true});
}

const aboutManifesto=document.querySelector('.about-manifesto');
const aboutChapters=[...document.querySelectorAll('.manifesto-chapter')];
if(aboutManifesto&&aboutChapters.length){
  const chapterObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)aboutChapters.forEach(c=>c.classList.toggle('is-active',c===entry.target))}),{threshold:.55});
  aboutChapters.forEach(chapter=>chapterObserver.observe(chapter));
  addEventListener('scroll',()=>{const rect=aboutManifesto.getBoundingClientRect();const distance=aboutManifesto.offsetHeight-innerHeight;const progress=Math.max(0,Math.min(1,-rect.top/Math.max(distance,1)));aboutManifesto.style.setProperty('--about-progress',progress.toFixed(3))},{passive:true});
}
const aboutProfile=document.querySelector('.about-profile');
if(aboutProfile){
  const profileCards=[...aboutProfile.querySelectorAll('.profile-glass-card')];
  let profileTimer;
  const activateProfileCard=index=>{profileCards.forEach((card,i)=>card.classList.toggle('is-active',i===index));aboutProfile.style.setProperty('--profile-shift',`${index*100}%`);if(innerWidth<=600){const rail=profileCards[index]?.parentElement;rail?.scrollTo({left:profileCards[index].offsetLeft-(innerWidth-profileCards[index].offsetWidth)/2,behavior:'smooth'})}};
  new IntersectionObserver(([entry],observer)=>{if(!entry.isIntersecting)return;aboutProfile.classList.add('in-view');let index=0;activateProfileCard(index);if(!matchMedia('(prefers-reduced-motion: reduce)').matches)profileTimer=setInterval(()=>{index=(index+1)%profileCards.length;activateProfileCard(index)},2100);observer.disconnect()},{threshold:.22}).observe(aboutProfile);
}

const filterButtons=[...document.querySelectorAll('[data-filter]')];
const archiveCards=[...document.querySelectorAll('.archive-card')];
filterButtons.forEach(button=>button.addEventListener('click',()=>{const filter=button.dataset.filter;filterButtons.forEach(b=>b.classList.toggle('active',b===button));archiveCards.forEach(card=>card.classList.toggle('hidden',filter!=='all'&&!card.dataset.sector.split(' ').includes(filter)))}));

const showcaseRows=[...document.querySelectorAll('.showcase-row')];
if(showcaseRows.length&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
  document.body.classList.add('work-enhanced');
  const workObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)entry.target.classList.add('in-view')}),{threshold:.2});
  showcaseRows.forEach(row=>{workObserver.observe(row);if(matchMedia('(pointer:fine)').matches){row.addEventListener('pointermove',e=>{const r=row.getBoundingClientRect();row.style.setProperty('--work-x',`${((e.clientX-r.left)/r.width-.5)*-16}px`);row.style.setProperty('--work-y',`${((e.clientY-r.top)/r.height-.5)*-12}px`)},{passive:true});row.addEventListener('pointerleave',()=>{row.style.setProperty('--work-x','0px');row.style.setProperty('--work-y','0px')},{passive:true})}});
}
