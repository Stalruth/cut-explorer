<script lang="ts">
let {title, items, query=$bindable(), total, equivalents} = $props();

const sortedItems = $derived(items.toSorted((a, b) => {
  const values = {
    undefined: 2,
    true: 1,
    false: 0
  };

  return values[query.get(a.name)] - values[query.get(b.name)];
}));

function editQuery(e) {
  if(e.target.checked) {
    query.set(e.target.value, true);
  } else {
    query.delete(e.target.value);

    const category = equivalents?.categories?.[e.target.value];
    if(category) {
      for(let item of category) {
        query.delete(item);
      }
    }
  }
}
</script>

<h3>
  {title}
</h3>

<ul class="checklist">
  {#each sortedItems as item (item.name)}
    <li>
      <label>
        <input
          type="checkbox"
          value={item.name}
          checked={query.get(item.name) === true || item.count === total}
          disabled={query.get(item.name) === undefined && item.count === total}
          onchange={editQuery}
        >
        {item.displayName ?? item.name} ({item.count}/{total})
      </label>
      {#if item.children && (query.get(item.name) !== undefined || item.count === total)}
        <ul class="checklist">
          {#each item.children as child (child.name)}
            <li>
              <label>
                <input
                  type="checkbox"
                  value={child.name}
                  checked={query.get(child.name) === true || child.count === total}
                  disabled={query.get(child.name) === undefined && child.count === total}
                  onchange={editQuery}
                >
                {child.displayName ?? child.name} ({child.count}/{total})
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
</style>
