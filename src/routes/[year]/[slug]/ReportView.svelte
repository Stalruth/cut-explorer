<script>
import Detail from './Detail.svelte';

import * as stats from '$lib/stats.js';
import sortRestricted from '$lib/sortRestricted.js';

export let query = {};
export let results = {};
export let equivalents = {};

function getCheckHandler(queryType) {
  return (e) => {
    if(!query[queryType]) {
      query[queryType] = new Map();
    }
    if(['Y', 'N'].includes(e.target.value)) {
      query[queryType] = query[queryType].set(e.target.name, e.target.value === 'Y');
    } else {
      query[queryType].delete(e.target.name);

      const category = equivalents[queryType]?.categories?.[e.target.name];
      if(category) {
        for(let item of category) {
          query[queryType].delete(item);
        }
      }
      query[queryType] = query[queryType];
    }
  }
}

$: teammates = results.teammates.toSorted((a,b) => sortRestricted(a.name, b.name) || stats.collationSorter(a,b))
</script>

<h2>{results?.species?.[0]?.name}</h2>

<div class="report">
  <div>
    <Detail
      title="Tera Types"
      changeHandler={getCheckHandler('teraType')}
      items={results.teraType}
      query={query.teraType ?? new Map()}
      total={results.total}
    />
  </div>

  <div>
    <Detail
      title="Abilities"
      changeHandler={getCheckHandler('ability')}
      items={results.ability}
      query={query.ability ?? new Map()}
      total={results.total}
    />
  </div>

  <div>
    <Detail
      title="Items"
      changeHandler={getCheckHandler('item')}
      items={results.item}
      query={query.item ?? new Map()}
      total={results.total}
    />
  </div>

  <div>
    <Detail
      title="Moves"
      changeHandler={getCheckHandler('moves')}
      items={results.moves}
      query={query.moves ?? new Map()}
      total={results.total}
    />
  </div>

  <div>
    <Detail
      title="Teammates"
      changeHandler={getCheckHandler('teammates')}
      items={teammates}
      query={query.teammates ?? new Map()}
      total={results.total}
    />
  </div>
</div>

<style>
.report {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 50px;
}

.report > div {
  flex-grow: 1;
  flex-basis: 30%;
  min-width: max-content;
}
</style>
