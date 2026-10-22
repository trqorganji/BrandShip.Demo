// Extract and downsample supplied portraits for the website. No retouching or
// generated imagery: the original presentations remain untouched.
import { execFileSync } from 'node:child_process';
import { mkdir, mkdtemp, writeFile, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { partners, people } from '../src/team-people-data.mjs';
const presentation = process.argv[2];
if (!presentation) throw new Error('Pass the path to the supplied PowerPoint presentation.');
const temporary = await mkdtemp(join(tmpdir(), 'brandship-portraits-'));
const destination = new URL('../public/assets/team/', import.meta.url);
await mkdir(destination, { recursive: true });
let total = 0;
for (const entry of [...partners, ...people]) {
  const original = join(temporary, entry.source);
  const output = new URL(`${entry.id}.jpg`, destination);
  await writeFile(original, execFileSync('unzip', ['-p', presentation, `ppt/media/${entry.source}`], { maxBuffer: 12 * 1024 * 1024 }));
  const dimensions = execFileSync('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', original], { encoding: 'utf8' });
  const longestEdge = Math.max(...[...dimensions.matchAll(/pixel(?:Width|Height):\s*(\d+)/g)].map(match => Number(match[1])));
  const resize = longestEdge > 1100 ? ['-Z', '1100'] : [];
  execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '82', ...resize, original, '--out', output.pathname], { stdio: 'pipe' });
  total += (await stat(output)).size;
}
console.log(`Prepared ${partners.length + people.length} original portraits (${(total / 1024 / 1024).toFixed(2)} MB total).`);
console.log(`Extraction originals retained temporarily at ${temporary}. Source presentation unchanged.`);
