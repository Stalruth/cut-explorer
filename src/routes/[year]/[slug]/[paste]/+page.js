export async function load({ fetch, params, url }) {
  const tournament = await (await fetch(`/data/tournaments/${params.year}/${params.slug}.json`)).json();
  
  for(let entry of tournament.teams) {
    if(params.paste === entry.paste) {
      return {
        tourName: tournament.name,
        player: entry
      };
    }
  }
  
  return {
    year: params.year,
    tourId: params.slug,
    tourName: tournament.name,
    player: undefined
  };
}
