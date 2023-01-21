<script>
export let title = '';
export let changeHandler = ()=>{};
export let items = {};
export let query = [];
export let total = 1;

$: queryItems = [query].flat();
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
<ul>
  {#each sortedItems as item (item.name)}
    <li>
      <label>
        <input
          type="checkbox"
          value={item.name}
          on:change={changeHandler}
          checked={queryItems.includes(item.name)}
        >
        {item.name} ({item.count}/{total})
      </label>
    </li>
  {/each}
</ul>

<style>
ul {
  list-style-type: none;
  padding-left: 0;
}
</style>
