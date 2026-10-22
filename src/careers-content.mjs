// The public board, build check and HR editor share one plain-text content contract.
export const APPLICATION_EMAIL = 'labeeb@ourbrandship.com';
export const EMPLOYMENT_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship'];
export const CAREER_TEAMS = ['Strategy', 'Creative', 'Marketing & communication', 'Project management', 'Business development', 'Operations', 'Other'];
export function validCareerText(value, max) {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= max && !/[\x00-\x1f\x7f\u2013\u2014]|--/.test(value);
}
export function validateCareersContent(content) {
  if (content?.version !== 1 || !Array.isArray(content.jobs) || content.jobs.length > 50) throw new Error('Invalid careers content.');
  return content.jobs.map(job => {
    if (!job || !validCareerText(job.title, 80) || !CAREER_TEAMS.includes(job.team) || !validCareerText(job.location, 80) || !EMPLOYMENT_TYPES.includes(job.type) || typeof job.open !== 'boolean' || !Array.isArray(job.requirements) || job.requirements.length < 1 || job.requirements.length > 4 || !job.requirements.every(item => validCareerText(item, 140))) throw new Error('Each position needs a title, team, location, type and 1 to 4 brief requirements.');
    return { title: job.title.trim(), team: job.team, location: job.location.trim(), type: job.type, open: job.open, requirements: job.requirements.map(item => item.trim()) };
  });
}
export function careerApplicationHref(title) {
  const subject = title ? `Career application: ${title} | Brandship` : 'Brandship career application';
  return `mailto:${APPLICATION_EMAIL}?subject=${encodeURIComponent(subject)}`;
}
