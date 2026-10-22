import './careers-admin.css';
import { careersAuthOrigin, createCareersCmsConfig } from './careers-cms-config.mjs';
import { validateCareersContent } from './careers-content.mjs';

const button = document.querySelector('#hr-open-editor');
const status = document.querySelector('#hr-connection-status');
const welcome = document.querySelector('#hr-welcome');
const authOrigin = careersAuthOrigin(import.meta.env.VITE_CAREERS_CMS_AUTH_ORIGIN);
const siteUrl = new URL(import.meta.env.BASE_URL, location.origin).href;
const config = authOrigin ? createCareersCmsConfig({ authOrigin, siteUrl }) : null;
status.textContent = config
  ? 'GitHub sign-in is configured. Only authorised repository contributors can publish.'
  : 'Publishing is not connected yet. A site administrator must configure secure GitHub sign-in before the HR editor can open.';
button.disabled = !config;
document.body.dataset.cmsState = config ? 'configured' : 'setup-required';
let loading = false;
button.addEventListener('click', async () => {
  if (!config || loading) return;
  loading = true;
  button.disabled = true;
  status.textContent = 'Loading the secure editor. No content has been changed.';
  window.CMS_MANUAL_INIT = true;
  try {
    if (!window.CMS) await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      // Pinned, admin-only dependency. Public Careers never downloads the CMS.
      script.src = 'https://cdn.jsdelivr.net/npm/decap-cms@3.17.1/dist/decap-cms.js';
      script.crossOrigin = 'anonymous';
      const timer = setTimeout(() => { script.remove(); reject(new Error('Editor load timed out.')); }, 20000);
      script.onload = () => { clearTimeout(timer); resolve(); };
      script.onerror = () => { clearTimeout(timer); script.remove(); reject(new Error('Editor could not load.')); };
      document.head.append(script);
    });
    const cms = window.CMS;
    if (!cms?.init) throw new Error('Editor is unavailable.');
    cms.registerEventListener({ name: 'preSave', handler: ({ entry }) => {
      const original = entry.get('data');
      const data = original.get('jobs') == null ? original.set('jobs', []) : original;
      validateCareersContent(data.toJS());
      return data;
    } });
    const React = window.h;
    if (React && cms.registerPreviewTemplate) {
      cms.registerPreviewStyle('body{font:15px/1.7 system-ui;background:#090c10;color:#edf5fa;padding:24px}h2{font-size:32px;line-height:1.2}article{border:1px solid #405362;border-radius:12px;background:#111b24;padding:24px;margin:20px 0}small{color:#8fd7ff}p{color:#b0c5d5}li{margin-bottom:8px}', { raw: true });
      cms.registerPreviewTemplate('positions', ({ entry }) => {
        const data = entry.get('data').toJS();
        const jobs = (data.jobs || []).filter(job => job.open);
        return React('div', {}, React('h2', {}, 'Open positions'), React('p', {}, 'Preview only. Applicants see published open roles after deployment.'), ...jobs.map((job, i) => React('article', { key: i }, React('small', {}, job.team), React('h3', {}, job.title), React('p', {}, `${job.location || ''} · ${job.type || ''}`), React('ul', {}, ...(job.requirements || []).map((text, j) => React('li', { key: j }, text))))), !jobs.length && React('p', {}, 'No open positions. General applications remain available.'));
      });
    }
    welcome.hidden = true;
    document.body.dataset.cmsState = 'editor';
    cms.init({ config });
  } catch {
    welcome.hidden = false;
    status.textContent = 'The editor could not open. Check your connection and try again. Nothing has been published.';
    button.disabled = false;
    loading = false;
  }
});
