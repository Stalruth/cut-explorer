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
  return collate(data.map(team => team.team.map(set => set.species)).flat());
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

function querySets(data, parameters) {
  const sets = [];
  data.forEach(player => {
    player.team.forEach(set => {
      if(matchSet(set, parameters)) {
        sets.push(set);
      }
    });
  });
  return sets;
}

function report(data, queryArgs) {
  const result = querySets(data, queryArgs);
  const report = {
    total: result.length,
  };
  ['species','item','ability','teraType', 'moves', 'teammates'].forEach(field => {
    report[field] = collate(result.map(set => set[field]).flat());
  });
  return report;
}

function queryPlayers(data, query) {
  const players = [];
  data.forEach(player => {
    if(player.team.map(set => matchSet(set, query)).includes(true)) {
      players.push(player);
    }
  });
  return players;
}

export { getPokemonList, querySets, report, queryPlayers }

