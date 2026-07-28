import * as child_process from 'node:child_process';
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),

  kit: {
    adapter: adapter({
      fallback: 'offline.html',
      pages: process.env.OUT_DIR
    }),
    csp: {
      directives: {
        'base-uri': ['self'],
        'connect-src': ['self'],
        'default-src': ['self'],
        'font-src': ['self'],
        'form-action': ['self'],
        'frame-ancestors': ['self'],
        'script-src': ['self'],
        'style-src': ['self'],
        'unsafe-inline': ['img-src', 'self', 'data'],
      }
      mode: 'auto'
    },
    version: {
      name: child_process.execSync('git rev-parse HEAD').toString().trim()
    }
  }
};

export default config;
