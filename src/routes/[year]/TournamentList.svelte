<script lang="ts">
import { onMount } from 'svelte';
import { online } from 'svelte/reactivity/window';
let { tourInfo, year } = $props();

let cachedTours = $state([]);

function formatDates(start, end) {
  const months = {1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr', 5: 'May', 6: 'Jun',
              7: 'Jul', 8: 'Aug', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dec'};
  const startYear = start.year != end.year ? `-${start.year}` : '';
  const startDay = `${start.day}`.padStart(2, '0');
  const endDay = `${end.day}`.padStart(2, '0');
  return `${startDay}-${months[start.month] ?? start.month}${startYear} to ${endDay}-${months[end.month] ?? end.month}-${end.year}`;
}

onMount(async () => {
  const cache = await caches.open('data');
  cachedTours = (await cache.keys()).map(el => new URL(el.url).pathname);
});
</script>

{#each tourInfo as regulation, i}
  <details open={i == tourInfo.length - 1}>
    <summary>
      { regulation.name } ({ formatDates(regulation.start, regulation.end) })
    </summary>
    <ul>
      {#each regulation.tournaments as tour}
        <li>
          {#if online.current || online.current === undefined || cachedTours.includes(`/tournaments/${year}/${tour.id}.json`)}
            <a href="/{ year }/{ tour.id }">
              { tour.name }
            </a>
          {:else}
            <b>
              { tour.name }
            </b>
          {/if}
        </li>
      {/each}
    </ul>
  </details>
{/each}

