function collationSorter(a, b) {
  if (a.count < b.count) { return 1; }
  if (b.count < a.count) { return -1; }
  if (a.name < b.name) { return -1; }
  if (b.name < a.name) { return 1; }
  return 0;
}

function collate(array, queryArgs, equivalents) {
  const results = []
  const valueSet = new Set(array);
  const categorySet = new Set(array.map(el => equivalents?.values?.[el]));
  const categoryMap = new Map();

  for(let item of queryArgs) {
    if(item[1] === false) {
      valueSet.add(item[0]);
    }
  }

  for(let category of categorySet) {
    if(!category) {
      continue;
    }
    const node = {
      name: category,
      count: array.filter(el => equivalents?.values?.[el] === category).length,
      children: []
    };
    categoryMap.set(category, node);
    results.push(node);
  }

  for(let item of valueSet) {
    const node = {
      name: equivalents?.substitutes?.[item] ?? item,
      count: array.filter(el => el === item).length,
    };
    const category = equivalents?.values?.[item];
    if(category) {
      categoryMap.get(category).children.push(node);
      categoryMap.get(category).children.sort(collationSorter);
    } else {
      results.push(node);
    }
  }

  return results.sort(collationSorter);
}

function subtractCollations(a, b, queryArgs) {
  const result = new Map();
  for(const item of a) {
    result.set(item.name, item.count);
  }
  for(const item of b) {
    const newCount = (result.get(item.name) ?? 0) - item.count;
    if(newCount) {
      result.set(item.name, newCount);
    } else {
      if(queryArgs.get(item.name) === undefined) {
        result.delete(item.name);
      }
    }
  }
  return [...result].map(([k, v]) => ({"name": k, "count": v})).sort(collationSorter);
}

function getPokemonList(data) {
  return collate(data.map(({ team }) => (team ?? []).map(set => set.species)).flat(), new Map(), {});
}

function matchSet(set, team, {species, item, ability, teraType, moves, teammates}, equivalents) {
  function matchOne(queryValues, setValue, valueCategories) {
    for(const [key, value] of queryValues) {
      if((setValue === key || valueCategories?.[setValue] === key) !== value) {
        return false;
      }
    }
    return true;
  }

  function matchAll(queryValues, setValues, valueCategories) {
    for(const [key, value] of queryValues) {
      if((setValues.includes(key) || !!setValues.filter(el => valueCategories?.[el] === key).length) !== value) {
        return false;
      }
    }
    return true;
  }

  if(species && !matchOne(species, set.species, equivalents['species']?.['values'])) {
    return false;
  }
  if(item && !matchOne(item, set.item, equivalents['item']?.['values'])) {
    return false;
  }
  if(ability && !matchOne(ability, set.ability, equivalents['ability']?.['values'])) {
    return false;
  }
  if(teraType && !matchOne(teraType, set.teraType, equivalents['teraType']?.['values'])) {
    return false;
  }
  if(moves && !matchAll(moves, set.moves, equivalents['moves']?.['values'])) {
    return false;
  }
  const setTeammates = team.filter(el => el !== set).map(el => el.species);
  if(teammates && !matchAll(teammates, setTeammates))
  {
    return false;
  }

  return true;
}

function query(data, parameters, equivalents) {
  const sets = [];
  const players = [];
  data.forEach(player => {
    if(!player.team) {
      return;
    }
    const matches = player.team.filter(set => {
      return matchSet(set, player.team, parameters, equivalents);
    });
    if(matches.length) {
      sets.push(...matches);
      players.push(player);
    }
  });
  return {sets, players};
}

function report(data, queryArgs, equivalents) {
  const result = query(data, queryArgs, equivalents);
  const sets = {
    total: result.sets.length,
  };
  ['species','item','ability','teraType','moves'].forEach(field => {
    sets[field] = collate(result.sets.map(set => set[field]).flat(), queryArgs[field] ?? new Map(), equivalents[field]);
  });

  sets['teammates'] = subtractCollations(collate(
    result.players
    .map(player =>
      player.team.map(mon => mon.species)
    ).flat(),
  queryArgs['teammates'] ?? new Map()), sets['species'], queryArgs['teammates'] ?? new Map());
  return { sets, players: result.players };
}

export { getPokemonList, report, collationSorter }

