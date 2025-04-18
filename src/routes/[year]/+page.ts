import type { PageLoad } from './$types';

export const load: Pageload = async ({ fetch, params }) => {
  const tourInfo = await (
    await fetch(`https://api.cut-explorer.stalruth.dev/tournaments/${params.year}/tournaments.json`)
  ).json();

  return {
    tourInfo,
    year: params.year
  }
};

