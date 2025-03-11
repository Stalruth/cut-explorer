import type { PageLoad } from './$types';

export const load: Pageload = async ({ fetch, params }) => {
  const years = await (
    await fetch('/data/tournaments/years.json')
  ).json();
  const tourInfo = await (
    await fetch(`/data/tournaments/${years[years.length - 1]}/tournaments.json`)
  ).json();

  return {
    tourInfo,
    years
  }
};

