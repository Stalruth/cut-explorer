<script>
export let title = '';
export let changeHandler = ()=>{};
export let items = [];
export let query = new Map();
export let total = 0;

$: queryItems = [...query].filter(el => el[1]).map(el => el[0]);
$: sortedItems = items.sort((a, b) => {
  if(queryItems.includes(a.name) === queryItems.includes(b.name)) {
    return 0
  }
  if(queryItems.includes(a.name)) {
    return -1;
  }
  return 1;
});
</script>

<h3>{title}</h3>
<ul class="checklist">
  {#each sortedItems as item (item.name)}
    <li>
      <label>
        <input
          type="checkbox"
          value={item.name}
          on:change={changeHandler}
          checked={queryItems.includes(item.name) || item.count === total}
          disabled={!queryItems.includes(item.name) && item.count === total}
        >
        {item.name} ({item.count}/{total})
      </label>
      {#if item.children && (queryItems.includes(item.name) || item.count === total)}
      <ul class="checklist">
        {#each item.children as child}
          <li>
            <label>
              <input
                type="checkbox"
                value={child.name}
                on:change={changeHandler}
                checked={queryItems.includes(child.name) || child.count === total}
                disabled={!queryItems.includes(child.name) && child.count === total}
              >
              {child.name} ({child.count}/{total})
            </label>
          </li>
        {/each}
      </ul>
      {/if}
    </li>
  {/each}
</ul>
