import * as child_process from 'node:child_process';
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    sveltekit({
      preprocess: vitePreprocess(),
      adapter: adapter({
        fallback: 'offline.html',
        pages: process.env.OUT_DIR
      }),
      csp: {
        directives: {
          'base-uri': ['self'],
          'connect-src': ['self', 'https://api.cut-explorer.stalruth.dev'],
          'default-src': ['self'],
          'font-src': ['self'],
          'form-action': ['self'],
          'frame-ancestors': ['self'],
          'img-src': ['self', 'data'],
          'script-src': ['self', 'unsafe-inline'],
          'style-src': ['self', 'unsafe-inline']
        },
        mode: 'hash'
      },
      version: {
        name: child_process.execSync('git rev-parse HEAD').toString().trim()
      }
    })
  ]
});
