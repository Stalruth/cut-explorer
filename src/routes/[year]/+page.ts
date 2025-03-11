import type { PageLoad } from './$types';

export const load: Pageload = async ({ fetch, params }) => {
  const tourInfo = await (
    await fetch(`/data/tournaments/${params.year}/tournaments.json`)
  ).json();

  return {
    tourInfo,
    year: params.year
  }
};

