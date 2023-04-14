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

let { protocol, hostname, port, tournament } = data;
let pokemon = '';
let partialQuery = {};
let stage = tournament.teams.length;

$: query = mergeQuery(pokemon, partialQuery);
$: teamList = tournament.teams.slice(0, stage);
$: results = stats.report(teamList, query);
$: pokemonList = stats.getPokemonList(teamList);

function clearScreen(e) {
  pokemon = '';
}
</script>

<svelte:head>
  <title>Top Cut Explorer: {tournament.name}</title>
  <meta property="og:title" content="Top Cut Explorer: {tournament.name}" />
  <meta property="og:url" content="https://cut-explorer.stalruth.dev/" />
  <meta property="og:description" content="Fine grained analytical tool for the {tournament.name} Top Cut teams." />
  <meta name="description" content="Fine grained analytical tool for the {tournament.name} Top Cut teams." />
</svelte:head>

<nav>
  <div>
    <a href="/">Index</a>
  </div>
</nav>

<h1>{tournament.name} Top Cut Explorer</h1>
<div class="controlbar">
  <div class="pokemon-select">
    <label>
      <PokemonSelector
        pokemonList={pokemonList}
        bind:pokemon={pokemon}
    />
    </label>
    {#if pokemon}
      <button
        on:click={clearScreen}
        class="secondary"
      >
        Clear
      </button>
    {/if}
  </div>
  <div>
    {#if tournament.stages}
      <label>
        Filter:
        <select bind:value={stage} on:change={clearScreen}>
          {#each tournament.stages as stage}
            <option value={stage.count ?? tournament.teams.length}>{stage.name}</option>
          {/each}
        </select>
      </label>
    {/if}
  </div>
</div>
{#if pokemon}
  <ReportView
    bind:query={query}
    results={results.sets}
  />
{/if}

<ResultsList
  players={results.players}
  hostname={hostname}
  protocol={protocol}
  port={port}
/>

<style>
div.controlbar {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}

div.pokemon-select {
  display: flex;
  gap: 1rem;
}

nav a::before {
  content: '← ';
}
</style>
