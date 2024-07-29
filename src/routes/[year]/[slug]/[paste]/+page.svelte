<script>
import getOrdinal from '$lib/getOrdinal.js';
import { onClickBack } from '$lib/layers.js';

export let data;

let { year, tourId, tourName, player } = data;
</script>

<svelte:head>
  <title>{player.name}'s {getOrdinal(player.top, true)} {tourName} Team - Top Cut Explorer</title>
  <meta property="og:title" content="{player.name}'s {getOrdinal(player.top, true)} {tourName} Team - Top Cut Explorer" />
  <meta property="og:url" content="https://cut-explorer.stalruth.dev/" />
  <meta property="og:description" content="Fine grained analytical tool for the {tourName} Top Cut teams." />
  <meta name="description" content="Fine grained analytical tool for the {tourName} Top Cut teams." />
</svelte:head>

<nav>
  <div>
    <a href={`/${year}/${tourId}`} on:click={onClickBack}>{tourName}</a>
  </div>
</nav>

{#if player}
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
{:else}
<h1>Unknown Team</h1>

<p>The link you followed was outdated or mistyped - the link above should get you back to a tournament page.</p>

<p>If you got here through just clicking around in the site then something went really weird. Please reach out to the developer (<a href="https://x.com/Stalruth">@Stalruth</a> on Twitter) and let him know what you did to get here!</p>

<p>Thanks for enjoying the Top Cut Explorer, and thanks in advance for helping make it better for everyone.</p>
{/if}

<style>
</style>
