<script>
export let title = '';
export let changeHandler = ()=>{};
export let items = [];
export let query = new Map();
export let total = 0;

$: sortedItems = items.sort((a, b) => {
  // I LOVE TYPE COERCION (true is 1 false is 0)
  return (query.get(a.name) ?? 2) - (query.get(b.name) ?? 2);
});

function getValueByQuery(item) {
  const value = query.get(item.name);
  if(value === true || item.count === total) {
    return 'Y';
  }
  if(value === false) {
    return 'N';
  }
  return '-';
}
</script>

<h3>{title}</h3>
<ul class="checklist">
  {#each sortedItems as item (item.name)}
    <li>
      <label>
        <select
          name={item.name}
          on:change={changeHandler}
          disabled={query.get(item.name) === undefined && item.count === total}
        >
          <option value="-" selected={getValueByQuery(item) === '-'}>-</option>
          <option value="Y" selected={getValueByQuery(item) === 'Y'}>Include</option>
          <option value="N" selected={getValueByQuery(item) === 'N'}>Exclude</option>
        </select>
        {item.name} ({item.count}/{total})
      </label>
      {#if item.children && (query.get(item.name) === true || item.count === total)}
        <ul class="checklist">
          {#each item.children as child}
            <li>
              <label>
                <select
                  name={child.name}
                  value={getValueByQuery(child)}
                  on:change={changeHandler}
                  disabled={query.get(child.name) !== true && child.count === total}
                >
                  <option value="-">-</option>
                  <option value="Y">Include</option>
                  <option value="N">Exclude</option>
                </select>
                {child.name} ({child.count}/{total})
              </label>
            </li>
          {/each}
        </ul>
      {/if}
    </li>
  {/each}
</ul>

<style>
ul.checklist {
  list-style-type: none;
  padding-left: 0;
}

li ul.checklist {
  padding-left: 1.5rem;
}

ul select {
  display: inline-block;
}

</style>
