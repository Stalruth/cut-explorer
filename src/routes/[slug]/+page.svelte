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
let stage = data.teams.length;

$: query = mergeQuery(pokemon, partialQuery);
$: teamList = data.teams.slice(0, stage);
$: results = stats.report(teamList, query);
$: pokemonList = stats.getPokemonList(teamList);

function clearScreen(e) {
  pokemon = '';
}
</script>

<svelte:head>
  <title>Top Cut Explorer: {data.name}</title>
  <meta property="og:title" content="Top Cut Explorer: {data.name}" />
  <meta property="og:url" content="https://cut-explorer.stalruth.dev/" />
  <meta property="og:description" content="Fine grained analytical tool for the {data.name} Top Cut teams." />
  <meta name="description" content="Fine grained analytical tool for the {data.name} Top Cut teams." />
</svelte:head>

<nav>
  <div>
    <a href="/">Index</a>
  </div>
  <div>
    {#if data.stages}
      <label>
        Tournament Stage:
        <select bind:value={stage}>
          {#each data.stages as stage}
            <option value={stage.count ?? data.teams.length}>{stage.name}</option>
          {/each}
        </select>
      </label>
    {/if}
  </div>
</nav>

<h1>{data.name} Top Cut Explorer</h1>
<div class="controlbar">
  <PokemonSelector
    pokemonList={pokemonList}
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

nav select {
  display: inline;
}
</style>
