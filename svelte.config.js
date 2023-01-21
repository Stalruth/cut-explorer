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
          '/beani-brawl-rumble-ww-1',
          '/nino-sv-ff-62',
        ],
      },
    }),
  }
};

export default config;
