import { defineConfig } from 'vite';
import { resolve } from 'node:path';

const githubPages = process.env.GITHUB_PAGES === 'true';
const githubPagesBase = '/BrandShip.Demo/';

export default defineConfig({
  base: githubPages ? githubPagesBase : '/',
  plugins: [{
    name: 'preserve-final-design-styles',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        // Vite shares CSS between page entries. Keep the final design overrides
        // after page-specific legacy styles, matching the development cascade.
        const styles = [];
        const result = html.replace(/<link\b[^>]*rel="stylesheet"[^>]*>/g, tag => {
          styles.push(tag);
          return '';
        });
        // Shared legacy page rules must precede route-specific layouts, not just
        // the final consultancy overrides. Otherwise About reverts in production.
        const priority = tag => /\/pages-[^/]+\.css"/.test(tag) ? 0 : /\/consultancy-[^/]+\.css"/.test(tag) ? 2 : 1;
        styles.sort((a, b) => priority(a) - priority(b));
        return result.replace('</head>', `${styles.join('\n')}\n</head>`);
      }
    }
  }, ...(githubPages ? [{
    name: 'github-pages-links',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        return html
          .replace(/(<a\b[^>]*\bhref=")\/(?!\/)/g, `$1${githubPagesBase}`);
      }
    }
  }] : [])],
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
        caseStudy: resolve(process.cwd(), 'case-study.html'),
        practice: resolve(process.cwd(), 'practice.html'),
        team: resolve(process.cwd(), 'team.html'),
        hrAdmin: resolve(process.cwd(), 'admin/index.html')
      }
    }
  }
});
