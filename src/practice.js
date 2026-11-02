// Load the page's layout before inserting its content, not via a separate entry.
import './feedback-upgrade.css';
import './internal-heading-alignment.css';
import { enhanceBrandingOpening } from './branding-opening.js';
import { enhanceFuturisticRhythm } from './futuristic-rhythm.js';

const base = import.meta.env.BASE_URL;
const requestedArea = new URLSearchParams(location.search).get('area');
const area = ['branding', 'communication', 'web-development'].includes(requestedArea) ? requestedArea : 'branding';
const practices = {
  branding: {
    name: 'Branding', proposition: 'A clear idea. A distinctive expression.',
    intro: 'We help define what a brand stands for, then make that direction visible and consistent wherever it appears.',
    solve: 'When an organisation needs to clarify its purpose, position and personality, or translate a strategy into a recognisable identity.',
    approach: 'Start with context and research, define the strategic blueprint, then build and apply a coherent visual system. The exact phases depend on the brief.',
    capabilities: [
      ['Strategy', 'We differentiate your brand with a comprehensive blueprint, grounded in reality, that defines its purpose, positioning, tone of voice, and personality.'],
      ['Visual identity', 'We forge compelling brand identities, from logo design to comprehensive visual systems, that deeply resonate and stand out.'],
      ['Visual language', 'We engineer cohesive visual elements that powerfully communicates your brand essence through every design element.']
    ],
    deliverables: ['Brand platform and positioning framework', 'Identity guidelines and visual system', 'Application examples and rollout toolkit'],
    insight: 'Research and strategy perspectives that inform distinctive Saudi brands.',
    cases: [['King Salman Gate','king-salman-gate'],['Rua Al Haram','rua-al-haram'],['Qiddiya','qiddiya']]
  },
  'web-development': {
    name: 'Web Development', proposition: 'Your brand. Built for the web.',
    intro: 'We connect brand thinking, considered design and development to create websites that are clear to use and practical to manage.',
    solve: 'When your organisation needs a new website, a more intuitive digital experience or a platform your team can keep up to date.',
    approach: 'Understand your audiences and content, design the experience, build and test across screen sizes, then prepare your team for launch. The technology and scope are agreed around your needs.',
    capabilities: [
      ['Website design & development', 'Plan the structure, design the interface and develop a website that brings your brand into a clear, usable digital experience.'],
      ['Responsive experiences', 'Shape layouts and interactions for phones, tablets and desktops, with accessibility and performance considered throughout the build.'],
      ['CMS integration', 'Connect your website to an agreed content management system so your team can update pages and content without editing code.'],
      ['Website care & support', 'Plan handover, content guidance and ongoing updates around the support your team needs. Maintenance arrangements are agreed separately.']
    ],
    deliverables: ['Website structure and interface designs', 'Responsive website and CMS setup', 'Testing, launch guidance and content handover'],
    insight: 'Share what you want your website to do. We can define the right scope together.',
    cases: []
  },
  communication: {
    name: 'Marketing & communication', proposition: 'A brand that connects beyond the page.',
    intro: 'We connect brand direction with audiences, culture and channels through communication, creative expression and insight.',
    solve: 'When a brand needs an aligned voice, a compelling way to show up, and signals that help teams understand how it is received.',
    approach: 'Align brand voice and audience needs, design communication and activation, then use analytics and sentiment to learn. The exact phases depend on the brief.',
    capabilities: [
      ['MarCom strategies', 'We craft integrated marketing and communication frameworks that align your brand’s voice with the right audiences across every channel. We translate strategy into clear, compelling narratives for activation that drive engagement, consistency, and measurable brand impact.'],
      ['Analytics', 'We harness data insights to precisely measure brand performance and drive informed, impactful strategic decisions.'],
      ['Internal culture', "We cultivate a strong, unified internal culture that powerfully aligns your team with your brand's core values."],
      ['Sentiment analysis', "We decode public sentiment and emotions to reveal true perceptions and guide your brand's narrative."],
      ['Sonic branding', "We craft unique audio elements and soundscapes that resonate deeply and echo your brand's essence."],
      ['Video conceptualization', "We conceptualize captivating videos that powerfully narrate your brand's unique story and engage your audience."],
      ['AI lensing', 'We deploy AI to uncover profound insights and precisely optimize your brand strategies for maximum impact.']
    ],
    deliverables: ['Audience and channel strategy', 'Creative campaign concepts and content system', 'Measurement and governance framework'],
    insight: 'Thinking on culture, audience connection and brand performance.',
    cases: [['Madina Made','madina-made'],['King Salman Park','king-salman-park'],['Masar','masar']]
  }
};
const data = practices[area];
document.title = `${data.name} | Brandship`;
document.querySelector('meta[name="description"]')?.setAttribute('content', data.intro);
queueMicrotask(() => {
  enhanceBrandingOpening(area);
  enhanceFuturisticRhythm();
  if (area === 'communication') document.querySelector('.practice-method h2').innerHTML = 'From insight to activation<span class="blue-stop">.</span>';
});
document.querySelector('#practice-root').innerHTML = `<section class="practice-hero"><a class="feedback-text-link" href="${base}services.html">All services</a><p class="practice-eyebrow">Core domain</p><h1>${data.name}<span>.</span></h1><p>${data.proposition}</p></section><section class="practice-body"><div class="practice-lead"><span>Overview</span><p>${data.intro}</p></div><div class="practice-questions"><article><span>What we solve</span><h2>${data.solve}</h2></article><article><span>Our approach</span><p>${data.approach}</p></article></div><div class="practice-capabilities"><div class="feedback-heading"><span>Capabilities</span><h2>The work behind the promise<span class="blue-stop">.</span></h2></div><div>${data.capabilities.map(([name, description])=>`<article><h3>${name}</h3><p>${description}</p></article>`).join('')}</div></div><div class="practice-deliverables"><div class="feedback-heading"><span>Illustrative deliverables</span><h2>What an engagement might produce<span class="blue-stop">.</span></h2></div><p class="approval-note">Sample deliverables for layout; the actual scope is agreed for each project.</p><div>${data.deliverables.map((item,index)=>`<article><small>0${index+1}</small><h3>${item}</h3></article>`).join('')}</div></div><div class="practice-method"><div class="feedback-heading"><span>Methodology</span><h2>From understanding to expression<span class="blue-stop">.</span></h2></div><p>Discovery and research → strategic direction → creative development → activation → measurement and governance. Illustrative stages only; confirm the actual Brandship process before launch.</p></div><div class="practice-related"><div class="feedback-heading"><span>Selected cases</span><h2>See the practice in action<span class="blue-stop">.</span></h2></div><div>${data.cases.map(([name,slug])=>`<a href="${base}case-study.html?project=${slug}">${name}<span class="feedback-arrow" aria-hidden="true"></span></a>`).join('')}</div></div><div class="practice-related"><div class="feedback-heading"><span>Related thinking</span><h2>Explore the thinking<span class="blue-stop">.</span></h2></div><p class="approval-note">${data.insight}</p><a class="feedback-text-link" href="${base}insights.html">Visit Insights <span class="feedback-arrow" aria-hidden="true"></span></a></div></section>`;

if (area === 'web-development') {
  const enquiry = `${base}contact.html?service=web-development#service-request`;
  const arrow = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg>';
  const cta = document.createElement('a');
  cta.className = 'request-form-cta';
  cta.href = enquiry;
  cta.innerHTML = `Start a web project ${arrow}`;
  document.querySelector('.practice-hero').append(cta);
  // Branding case studies must not imply that Web Development delivered those sites.
  const [cases, close] = document.querySelectorAll('.practice-related');
  cases.remove();
  close.querySelector('.feedback-heading>span').textContent = 'Your next digital chapter';
  close.querySelector('h2').innerHTML = 'Let’s build what’s next<span class="blue-stop">.</span>';
  close.querySelector('a').href = enquiry;
  close.querySelector('a').innerHTML = `Start a web project ${arrow}`;
  document.querySelector('.practice-method h2').innerHTML = 'From first idea to launch<span class="blue-stop">.</span>';
  document.querySelector('.practice-method>p').textContent = 'Discovery, content and user journeys, interface design, development and CMS integration, testing, then launch and handover. Each engagement is shaped around the agreed scope.';
  document.querySelector('.consultancy-close h2').textContent = 'What’s next for your website?';
  document.querySelector('.consultancy-close a').href = enquiry;
}
