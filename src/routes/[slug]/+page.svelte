<script>
import PokemonSelector from '$lib/components/PokemonSelector.svelte';
import ReportView from '$lib/components/ReportView.svelte';
import ResultsList from '$lib/components/ResultsList.svelte';

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
$: setResults = stats.report(data.teams, query);
$: playerResults = stats.queryPlayers(data.teams, query);
</script>

<svelte:head>
  <title>Top Cut Explorer: {data.name}</title>
  <meta property="og:title" content="Top Cut Explorer: {data.name}" />
  <meta property="og:url" content="https://cut-explorer.stalruth.dev/" />
  <meta property="og:description" content="Fine grained analytical tool for VGC Top Cut teams." />
</svelte:head>

<nav>
  <a href="/">Back</a>
</nav>

<h1>{data.name} Top Cut Explorer</h1>
<PokemonSelector
  pokemonList={stats.getPokemonList(data.teams)}
  bind:pokemon={pokemon}
/>
{#if pokemon}
  <ReportView
    bind:query={query}
    results={setResults}
  />
{/if}

<ResultsList
  players={playerResults}
/>

<style>
nav a::before {
  content: '← ';
}
</style>
