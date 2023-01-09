<script>
export let title = '';
export let changeHandler = ()=>{};
export let items = {};
export let query = [];
export let total = 1;

$: queryItems = [query].flat();
</script>

<div>
  <h3>{title}</h3>
  <ul>
    {#each items as item (item.name)}
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
</div>

<style>
ul {
  list-style-type: none;
}
</style>
