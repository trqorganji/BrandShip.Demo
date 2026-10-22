import { CAREER_TEAMS, EMPLOYMENT_TYPES } from './careers-content.mjs';

export function careersAuthOrigin(raw) {
  if (!raw?.trim()) return null;
  try {
    const url = new URL(raw.trim());
    if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash || url.pathname !== '/') return null;
    return url.origin;
  } catch { return null; }
}
const textPattern = max => [`^(?!.*(?:--|[\\u2013\\u2014]))[^\\x00-\\x1F\\x7F]{1,${max}}$`, `Use 1 to ${max} characters, with ordinary punctuation and no line breaks.`];
export function createCareersCmsConfig({ authOrigin, siteUrl }) {
  if (!careersAuthOrigin(authOrigin)) throw new Error('Configure an approved HTTPS OAuth origin first.');
  return {
    load_config_file: false,
    backend: { name: 'github', repo: 'trqorganji/BrandShip.Demo', branch: 'main', base_url: authOrigin, auth_endpoint: 'auth' },
    site_url: siteUrl,
    display_url: `${siteUrl}careers.html#positions`,
    logo_url: `${siteUrl}assets/brandship-logo.png`,
    media_folder: 'public/assets/hr',
    public_folder: `${new URL(siteUrl).pathname}assets/hr`,
    editor: { preview: true },
    collections: [{
      name: 'careers', label: 'Careers', delete: false,
      description: 'Manage positions, brief requirements and whether applications are open.',
      files: [{
        name: 'positions', label: 'Open positions', file: 'public/content/careers.json', format: 'json',
        fields: [
          { name: 'version', widget: 'hidden', default: 1 },
          { name: 'jobs', label: 'Positions', label_singular: 'Position', widget: 'list', default: [], min: 0, max: 50, required: false, collapsed: true, summary: '{{fields.title}} / {{fields.team}}', allow_add: true, allow_remove: true, allow_reorder: true,
            hint: 'Add a position, or open one to edit it. Switch off Accepting applications to close it without deleting its details. Publish to update the website after deployment.',
            fields: [
              { name: 'title', label: 'Role title', widget: 'string', pattern: textPattern(80), hint: 'For example: Brand designer.' },
              { name: 'team', label: 'Team', widget: 'select', options: CAREER_TEAMS },
              { name: 'location', label: 'Location or working arrangement', widget: 'string', pattern: textPattern(80), hint: 'For example: Riyadh or Remote. Use the actual arrangement for this role.' },
              { name: 'type', label: 'Employment type', widget: 'select', options: EMPLOYMENT_TYPES },
              { name: 'requirements', label: 'Brief requirements', label_singular: 'Requirement', widget: 'list', min: 1, max: 4, default: [], collapsed: false, field: { name: 'requirement', label: 'Requirement', widget: 'string', pattern: textPattern(140) }, hint: 'Write 1 to 4 short points, up to 140 characters each. Plain text only.' },
              { name: 'open', label: 'Accepting applications', widget: 'boolean', default: true, hint: 'Only positions with this switched on appear on the public website.' }
            ] }
        ]
      }]
    }]
  };
}
