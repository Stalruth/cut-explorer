import { PUBLIC_API_URL } from '$env/static/public';
import type { PageLoad } from './$types';

export const load: Pageload = async ({ fetch, params }) => {
  const [
    tournamentResponse,
    equivalentsResponse
  ] = await Promise.all([
    fetch(`${PUBLIC_API_URL}/tournaments/${params.year}/${params.slug}.json`),
    fetch(`https://api.cut-explorer.stalruth.dev/equivalents.json`)
  ]);

  const tournament = await tournamentResponse.json();
  const equivalents = await equivalentsResponse.json();

  for(let i of ['item', 'moves', 'species', 'nature']) {
    equivalents[i].values = {};
    for(let category of Object.getOwnPropertyNames(equivalents[i].categories)) {
      for(let value of equivalents[i].categories[category]) {
        equivalents[i].values[value] = category;
      }
    }
  }
  equivalents['teammates'] = equivalents['species'];

  return {
    tournament,
    equivalents,
    tourId: params.slug,
    year: params.year
  }
};

