import type { PageLoad } from './$types';

export const load: Pageload = async ({ fetch, params }) => {
  const [
    yearsResponse,
    tourInfoResponse
  ] = await Promise.all([
    fetch('https://api.cut-explorer.stalruth.dev/tournaments/years.json'),
    fetch(`https://api.cut-explorer.stalruth.dev/tournaments/current-year.json`)
  ]);

  return {
    tourInfo: await tourInfoResponse.json(),
    years: await yearsResponse.json()
  }
};

