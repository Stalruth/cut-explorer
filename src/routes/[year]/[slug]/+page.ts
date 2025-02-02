import type { PageLoad } from './$types';

export const load: Pageload = async ({ fetch, params }) => {
  const tournament = await (
    await fetch(`/data/tournaments/${params.year}/${params.slug}.json`)
  ).json();
  const equivalents = await (
    await fetch('/data/equivalents.json')
  ).json();

  for(let i of ['item', 'moves', 'species']) {
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

