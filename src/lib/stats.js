function collate(array) {
  const set = new Set(array);
  const results = []
  for(let item of set) {
    results.push({
      name: item,
      count: array.filter(el => el === item).length,
    })
  }
  return results.sort((a,b) => {
    if (a.count < b.count) { return 1; }
    if (b.count < a.count) { return -1; }
    return 0;
  });
}

function getPokemonList(data) {
  return collate(data.map(({ team }) => team.map(set => set.species)).flat());
}

function matchSet(set, {species, item, ability, teraType, moves, teammates}) {
  if(species && species !== set.species) {
    return false;
  }
  if(item && item !== set.item) {
    return false;
  }
  if(ability && ability !== set.ability) {
    return false;
  }
  if(teraType && teraType !== set.teraType) {
    return false;
  }
  if(moves && !moves.map(move=>set.moves.includes(move)).reduce((a,c)=>a&&c, true)) {
    return false;
  }
  if(teammates && !teammates.map(move=>set.teammates.includes(move)).reduce((a,c)=>a&&c, true)) {
    return false;
  }

  return true;
}

function query(data, parameters) {
  const sets = [];
  const players = [];
  data.forEach(player => {
    const matches = player.team.filter(set => {
      return matchSet(set, parameters);
    });
    if(matches.length) {
      sets.push(...matches);
      players.push(player);
    }
  });
  return {sets, players};
}

function report(data, queryArgs) {
  const result = query(data, queryArgs);
  const sets = {
    total: result.sets.length,
  };
  ['species','item','ability','teraType', 'moves', 'teammates'].forEach(field => {
    sets[field] = collate(result.sets.map(set => set[field]).flat());
  });
  return { sets, players: result.players };
}

export { getPokemonList, query, report }

