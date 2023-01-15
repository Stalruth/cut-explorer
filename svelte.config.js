import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({
      prerender: {
        // Add new pages here
        entries: [
          '/',
          '/regionals-san-diego',
          '/nino-sv-ff-62',
        ],
      },
    }),
  }
};

export default config;
