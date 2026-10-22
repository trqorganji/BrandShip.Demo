import { readFile } from 'node:fs/promises';
import { validateCareersContent } from '../src/careers-content.mjs';
const content = JSON.parse(await readFile(new URL('../public/content/careers.json', import.meta.url), 'utf8'));
const jobs = validateCareersContent(content);
console.log(`Careers content validated: ${jobs.length} positions, ${jobs.filter(job => job.open).length} open.`);
