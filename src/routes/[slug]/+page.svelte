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
$: results = stats.report(data.teams, query);

function clearScreen(e) {
  pokemon = '';
}
</script>

<svelte:head>
  <title>{data.explorer_name ?? 'Top Cut'} Explorer: {data.name}</title>
  <meta property="og:title" content="{data.explorer_name ?? 'Top Cut'} Explorer: {data.name}" />
  <meta property="og:url" content="https://cut-explorer.stalruth.dev/" />
  <meta property="og:description" content="Fine grained analytical tool for the {data.name} {data.explorer_name ?? 'Top Cut'} teams." />
  <meta name="description" content="Fine grained analytical tool for the {data.name} {data.explorer_name ?? 'Top Cut'} teams." />
</svelte:head>

<nav>
  <a href="/">Index</a>
</nav>

<h1>{data.name} {data.explorer_name ?? 'Top Cut'} Explorer</h1>
<div class="controlbar">
  <PokemonSelector
    pokemonList={stats.getPokemonList(data.teams)}
    bind:pokemon={pokemon}
  />
  {#if pokemon}
    <button
      on:click={clearScreen}
    >
      Clear Pokémon
    </button>
  {/if}
</div>
{#if pokemon}
  <ReportView
    bind:query={query}
    results={results.sets}
  />
{/if}

<ResultsList
  players={results.players}
/>

<style>
button {
  padding: 0.4rem 0.8rem;
  margin: 0 0 1rem 0;
  border: 0;
}

div.controlbar {
  display: flex;
  gap: 1rem;
}

nav a::before {
  content: '← ';
}
</style>
