<script lang="ts">
let { tourInfo, year } = $props();

function formatDates(start, end) {
  const startYear = start.year != end.year ? `-${start.year}` : '';
  const startDay = `${start.day}`.padStart(2, '0');
  const endDay = `${end.day}`.padStart(2, '0');
  return `${startDay}-${start.month}${startYear} to ${endDay}-${end.month}-${end.year}`;
}
</script>

{#each tourInfo as regulation, i}
  <details open={i == tourInfo.length - 1}>
    <summary>
      { regulation.name } ({ formatDates(regulation.start, regulation.end) })
    </summary>
    <ul>
      {#each regulation.tournaments as tour}
        <li>
          <a href="/{ year }/{ tour.id }">
            { tour.name }
          </a>
        </li>
      {/each}
    </ul>
  </details>
{/each}

