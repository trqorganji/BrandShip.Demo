import { originalServiceCapabilities as services } from './feedback-upgrade.js';
import './capability-studio.css';

const root = document.querySelector('.services-catalogue .practice-overview');
if (root && services.length) {
  const base = import.meta.env.BASE_URL;
  root.classList.add('capability-studio');
  const arrow = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg>';
  const domains = [
    {name:'Branding', area:'branding', intro:'Define what your brand stands for. Make it unmistakable.', items:services.slice(0,3)},
    {name:'Marketing & communication', area:'communication', intro:'Connect your brand with audiences, culture and channels.', items:services.slice(3)}
  ];
  root.innerHTML = `<div class="feedback-heading"><span>Our capabilities</span><h2>A connected practice<span class="blue-stop">.</span></h2></div><p class="capability-intro">Two core domains. Explore every service below.</p><div class="capability-practices">${domains.map(domain=>`<section class="capability-domain" aria-label="${domain.name}"><div class="capability-domain-heading"><h3>${domain.name}</h3><p>${domain.intro}</p><a href="${base}practice.html?area=${domain.area}">Explore the practice ${arrow}</a></div><div class="capability-services">${domain.items.map((service,index)=>`<details ${index===0?'open':''}><summary>${service.name}<span class="capability-toggle" aria-hidden="true"></span></summary><div class="capability-description"><p>${service.description}</p></div></details>`).join('')}</div></section>`).join('')}</div>`;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  root.querySelectorAll('details').forEach(detail=>detail.addEventListener('toggle',()=>{
    if(detail.open && !reduced.matches) detail.querySelector('.capability-description').animate([{opacity:.5,transform:'translateY(5px)'},{opacity:1,transform:'translateY(0)'}],{duration:300,easing:'cubic-bezier(.2,.7,.2,1)'});
  }));
}
