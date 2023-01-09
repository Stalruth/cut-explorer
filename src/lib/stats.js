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
  return collate(data.map(team => team.map(set => set.species)).flat());
}

function query(data, {species, item, ability, teraType, moves, teammates}) {
  const sets = [];
  data.forEach(team => {
    team.forEach(set => {
      if(species && species !== set.species) {
        return;
      }
      if(item && item !== set.item) {
        return;
      }
      if(ability && ability !== set.ability) {
        return;
      }
      if(teraType && teraType !== set.teraType) {
        return;
      }
      if(moves && !moves.map(move=>set.moves.includes(move)).reduce((a,c)=>a&&c, true)) {
        return;
      }
      if(teammates && !teammates.map(move=>set.teammates.includes(move)).reduce((a,c)=>a&&c, true)) {
        return;
      }
      sets.push(set);
    });
  });
  return sets;
}

function report(data, queryArgs) {
  const result = query(data, queryArgs);
  const report = {
    total: result.length,
  };
  ['species','item','ability','teraType', 'moves', 'teammates'].forEach(field => {
    report[field] = collate(result.map(set => set[field]).flat());
  });
  return report;
}

export { getPokemonList, query, report }

