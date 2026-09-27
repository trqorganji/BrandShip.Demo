import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
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
