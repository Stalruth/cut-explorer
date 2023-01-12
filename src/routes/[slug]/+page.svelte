<script>
import PokemonSelector from '$lib/components/PokemonSelector.svelte';
import ReportView from '$lib/components/ReportView.svelte';

import * as stats from '$lib/stats.js';

export let data;

function mergeQuery(species, partial) {
  if(species === partial.species) {
    return partial;
  }
  return { species };
}

let pokemon = '';
let partialQuery = {};

$: query = mergeQuery(pokemon, partialQuery);
$: results = stats.report(data.teams, query);
</script>

<svelte:head>
  <title>Top Cut Explorer: {data.name}</title>
  <meta property="og:title" content="Top Cut Explorer: {data.name}" />
  <meta property="og:url" content="https://cut-explorer.stalruth.dev/" />
  <meta property="og:description" content="Fine grained analytical tool for VGC Top Cut teams." />
</svelte:head>

<h1>{data.name} Top Cut Explorer</h1>
<PokemonSelector
  pokemonList={stats.getPokemonList(data.teams)}
  bind:pokemon={pokemon}
/>
{#if pokemon}
  <ReportView
    bind:query={query}
    results={results}
  />
{/if}

<style>
</style>
