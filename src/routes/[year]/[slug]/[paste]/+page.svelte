<script>
import getOrdinal from '$lib/getOrdinal.js';

export let data;

let { year, tourId, tourName, player } = data;
</script>

<svelte:head>
  <title>Top Cut Explorer: {tourName}</title>
  <meta property="og:title" content="Top Cut Explorer: {tourName}" />
  <meta property="og:url" content="https://cut-explorer.stalruth.dev/" />
  <meta property="og:description" content="Fine grained analytical tool for the {tourName} Top Cut teams." />
  <meta name="description" content="Fine grained analytical tool for the {tourName} Top Cut teams." />
</svelte:head>

<nav>
  <div>
    <a href={`/${year}/${tourId}`}>{tourName}</a>
  </div>
</nav>

<h1>{player.name}'s {getOrdinal(player.top, true)} Team</h1>

{#each player.team as set}
  <p>
    {set.species}
    {#if set.item}
      @ {set.item}
    {/if}
    <br>
    Ability: {set.ability}<br>
    Tera Type: {set.teraType}<br>
    {#each set.moves as move}
    - {move}<br>
    {/each}
  </p>
{/each}

<style>
</style>
