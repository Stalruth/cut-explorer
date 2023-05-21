<script>
import Detail from './Detail.svelte';

function getCheckHandler(queryType) {
  return e => {
    if(!query[queryType]) {
      query[queryType] = new Map();
    }
    if(e.target.checked) {
      query[queryType] = query[queryType].set(e.target.value, true);
    } else {
      query[queryType].delete(e.target.value);
      query[queryType] = query[queryType];
    }
  }
}

export let query = {};
export let results = {};
</script>

<h2>{results.species[0].name}</h2>

<div class="report">
  <div>
    <Detail
      title="Tera Types"
      changeHandler={getCheckHandler('teraType')}
      items={results.teraType}
      query={query.teraType}
      total={results.total}
    />
  </div>

  <div>
    <Detail
      title="Abilities"
      changeHandler={getCheckHandler('ability')}
      items={results.ability}
      query={query.ability}
      total={results.total}
    />
  </div>

  <div>
    <Detail
      title="Items"
      changeHandler={getCheckHandler('item')}
      items={results.item}
      query={query.item}
      total={results.total}
    />
  </div>

  <div>
    <Detail
      title="Moves"
      changeHandler={getCheckHandler('moves')}
      items={results.moves}
      query={query.moves}
      total={results.total}
    />
  </div>

  <div>
    <Detail
      title="Teammates"
      changeHandler={getCheckHandler('teammates')}
      items={results.teammates}
      query={query.teammates}
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
