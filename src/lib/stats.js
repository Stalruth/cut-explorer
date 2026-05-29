function collationSorter(a, b) {
  if (a.count < b.count) { return 1; }
  if (b.count < a.count) { return -1; }
  if (a.name < b.name) { return -1; }
  if (b.name < a.name) { return 1; }
  return 0;
}

function collate(array) {
  const results = [];
  const valueMap = new Map(array.map(el => [el, 0]));

  for(let item of array) {
    valueMap.set(item, valueMap.get(item) + 1)
  }

  const result = [...valueMap].map(el => ({name: el[0], count: el[1]})).sort(collationSorter);
  return result;
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

function applyEquivalents(collation, equivalents) {
  const results = [];
  const categories = new Map();

  for(let item of collation) {
    const subName = equivalents?.substitutes?.[item.name];
    if(subName) {
      item.displayName = subName;
    }

    const catName = equivalents?.values?.[item.name];
    if(catName) {
      const category = categories.get(catName) ?? {name: catName, count: 0, children: []};
      category.children.push(item);
      category.count += item.count;
      categories.set(catName, category);
    } else {
      results.push(item);
    }
  }

  for(let category of categories.values()) {
    category.children.sort(collationSorter);
    results.push(category);
  }
  return results.sort(collationSorter);
}

function getPokemonList(data, equivalents) {
  return applyEquivalents(collate(data.map(({ team }) => (team ?? []).map(set => set.species)).flat()), equivalents);
}

function matchSet(set, team, {species, item, ability, nature, teraType, moves, teammates}, equivalents) {
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
  if(nature && !matchOne(nature, set.nature, equivalents['nature']?.['values'])) {
    return false;
  }
  if(moves && !matchAll(moves, set.moves, equivalents['moves']?.['values'])) {
    return false;
  }
  const setTeammates = team.filter(el => el !== set).map(el => el.species);
  if(teammates && !matchAll(teammates, setTeammates, equivalents['teammates']?.['values']))
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

function report(data, fields, queryArgs, equivalents) {
  const result = query(data, queryArgs, equivalents);
  const sets = {
    total: result.sets.length,
  };

  fields.forEach(field => {
    sets[field] = collate(result.sets.map(set => set[field]).flat(), equivalents[field]);
  });

  sets['teammates'] = subtractCollations(collate(
    result.players
    .map(player =>
      player.team.map(mon => mon.species)
    ).flat()
  ), sets['species']);

  [...fields, 'teammates'].forEach(field => {
    sets[field] = applyEquivalents(sets[field], equivalents[field]);
  });

  return { sets, players: result.players };
}

export { getPokemonList, report, collationSorter }

