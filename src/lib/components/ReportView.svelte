<script>
import Detail from './Detail.svelte';

function getCheckHandler(queryType) {
  return e => {
    if(['item','ability','teraType'].includes(queryType)) {
      if(e.target.checked) {
        query[queryType] = e.target.value;
      } else {
        query[queryType] = undefined;
      }
    }

    if(['moves','teammates'].includes(queryType)) {
      if(e.target.checked) {
        query[queryType] = [...(new Set(query[queryType])), e.target.value];
      } else {
        const newQuery = new Set(query[queryType]);
        newQuery.delete(e.target.value);
        query[queryType] = [...newQuery];
      }
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
}
</style>
