const track = document.querySelector('.home-logo-track');
const projects = document.querySelector('.home-projects');
if (projects) {
 projects.classList.add('project-deck');
 projects.setAttribute('aria-label', 'Selected project deck. Swipe or choose a project below.');
 const cards=[...projects.children];
 const index=document.createElement('div');index.className='project-deck-index';
 const status=document.createElement('p');status.className='project-deck-status';status.setAttribute('aria-live','polite');
 let active=0;
 const buttons=cards.map((card,i)=>{const button=document.createElement('button');button.type='button';button.textContent=card.querySelector('h3').textContent.trim();button.addEventListener('click',()=>show(i));index.append(button);return button;});
 function show(next){active=(next+cards.length)%cards.length;cards.forEach((card,i)=>{const position=(i-active+cards.length)%cards.length;card.dataset.position=position;card.inert=position!==0;card.setAttribute('aria-hidden',String(position!==0));buttons[i].setAttribute('aria-pressed',String(position===0));});status.textContent=`${cards[active].querySelector('h3').textContent.trim()} — swipe to discover`;
 }
 projects.after(index,status);show(0);
 projects.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();show(active+(e.key==='ArrowRight'?1:-1));}});
 let start,swiped=false;projects.addEventListener('pointerdown',e=>{swiped=false;start={x:e.clientX,y:e.clientY};});
 projects.addEventListener('pointerup',e=>{if(start&&Math.abs(e.clientX-start.x)>50&&Math.abs(e.clientX-start.x)>Math.abs(e.clientY-start.y)){swiped=true;show(active+(e.clientX<start.x?1:-1));}start=null;});
 projects.addEventListener('pointercancel',()=>{start=null;});
 projects.addEventListener('click',e=>{if(swiped){e.preventDefault();swiped=false;}});
 projects.tabIndex=0;
}
if (track) {
  const copy = track.firstElementChild.cloneNode(true);
  copy.setAttribute('aria-hidden', 'true');
  track.append(copy);
  const button = document.querySelector('.home-logo-pause');
  button.addEventListener('click', () => {
    const paused = document.querySelector('.home-trust').classList.toggle('is-paused');
    button.setAttribute('aria-pressed', String(paused));
    button.textContent = paused ? 'Resume logos' : 'Pause logos';
  });
}
