import { defineConfig } from 'vite';
import { resolve } from 'node:path';

const githubPages = process.env.GITHUB_PAGES === 'true';
const githubPagesBase = '/BrandShip.Demo/';

export default defineConfig({
  base: githubPages ? githubPagesBase : '/',
  plugins: githubPages ? [{
    name: 'github-pages-links',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        return html
          .replace(/href="\/(about|services|work|insights|careers|contact|case-study)\.html/g, `href="${githubPagesBase}$1.html`)
          .replace(/href="\/"/g, `href="${githubPagesBase}"`);
      }
    }
  }] : [],
  build: {
    rollupOptions: {
      input: {
        home: resolve(process.cwd(), 'index.html'),
        about: resolve(process.cwd(), 'about.html'),
        services: resolve(process.cwd(), 'services.html'),
        work: resolve(process.cwd(), 'work.html'),
        insights: resolve(process.cwd(), 'insights.html'),
        careers: resolve(process.cwd(), 'careers.html'),
        contact: resolve(process.cwd(), 'contact.html'),
        caseStudy: resolve(process.cwd(), 'case-study.html')
      }
    }
  }
});
