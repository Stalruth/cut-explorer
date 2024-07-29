export async function load({ fetch, params, url }) {
  const tournament = await (await fetch(`/data/tournaments/${params.year}/${params.slug}.json`)).json();
  
  for(let entry of tournament.teams) {
    if(params.paste === entry.paste) {
      return {
        year: params.year,
        tourId: params.slug,
        paste: params.paste,
        tourName: tournament.name,
        player: entry
      };
    }
  }
  
  return {
    year: params.year,
    tourId: params.slug,
    paste: params.paste,
    tourName: tournament.name,
    player: undefined
  };
}
