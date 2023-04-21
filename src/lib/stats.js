function collationSorter(a, b) {
  if (a.count < b.count) { return 1; }
  if (b.count < a.count) { return -1; }
  if (a.name < b.name) { return -1; }
  if (b.name < a.name) { return 1; }
  return 0;
}

function collate(array) {
  const set = new Set(array);
  const results = []
  for(let item of set) {
    results.push({
      name: item,
      count: array.filter(el => el === item).length,
    })
  }
  return results.sort(collationSorter);
}

function subtractCollations(a, b) {
  const result = new Map();
  for(const item of a) {
    result.set(item.name, item.count);
  }
  for(const item of b) {
    const newCount = (result.get(item.name) ?? 0) - item.count;
    if(newCount) {
      result.set(item.name, newCount);
    } else {
      result.delete(item.name);
    }
  }
  return [...result].map(([k, v]) => ({"name": k, "count": v})).sort(collationSorter);
}

function getPokemonList(data) {
  return collate(data.map(({ team }) => team.map(set => set.species)).flat());
}

function matchSet(set, team, {species, item, ability, teraType, moves, teammates}) {
  function isSuperset(lhs, rhs) {
    return !lhs.map(item => rhs.includes(item))
        .reduce((acc, cur) => acc && cur, true)
  }

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
  if(moves && isSuperset(moves, set.moves))
  {
    return false;
  }
  const setTeammates = team.filter(el => el !== set).map(el => el.species);
  if(teammates && isSuperset(teammates, setTeammates))
  {
    return false;
  }

  return true;
}

function query(data, parameters) {
  const sets = [];
  const players = [];
  data.forEach(player => {
    const matches = player.team.filter(set => {
      return matchSet(set, player.team, parameters);
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
  ['species','item','ability','teraType','moves'].forEach(field => {
    sets[field] = collate(result.sets.map(set => set[field]).flat());
  });

  sets['teammates'] = subtractCollations(collate(
    result.players
    .map(player =>
      player.team.map(mon => mon.species)
    ).flat()
  ), sets['species']);
  return { sets, players: result.players };
}

export { getPokemonList, query, report }

