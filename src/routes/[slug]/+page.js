export async function load({ fetch, params, url }) {
  const protocol = url.protocol.slice(0, -1);
  const hostname = url.hostname;
  const port = url.port;
  const tournament = await fetch(`/data/tournaments/${params.slug}.json`);
  const equivalents = await (await fetch('data/equivalents.json')).json();

  equivalents.item.values = {};
  for(let category of Object.getOwnPropertyNames(equivalents.item.categories)) {
    for(let value of equivalents.item.categories[category]) {
      equivalents.item.values[value] = category;
    }
  }

  return {
    protocol,
    hostname,
    port,
    tournament: await tournament.json(),
    equivalents: equivalents
  };
}
