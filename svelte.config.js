import * as child_process from 'node:child_process';
import adapter from '@sveltejs/adapter-netlify';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter(),
    version: {
        name: child_process.execSync('git rev-parse HEAD').toString().trim()
    }
  }
};

export default config;
