export async function load({ fetch, params, url }) {
  const tournament = await fetch(`/data/tournaments/${params.year}/${params.slug}.json`);
  const equivalents = await (await fetch('/data/equivalents.json')).json();

  equivalents.item.values = {};
  for(let category of Object.getOwnPropertyNames(equivalents.item.categories)) {
    for(let value of equivalents.item.categories[category]) {
      equivalents.item.values[value] = category;
    }
  }

  return {
    tournament: await tournament.json(),
    equivalents,
    year: params.year,
  };
}
