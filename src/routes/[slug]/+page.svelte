<script>
import PokemonSelector from '$lib/components/PokemonSelector.svelte';
import ReportView from '$lib/components/ReportView.svelte';
import ResultsList from '$lib/components/ResultsList.svelte';

import * as stats from '$lib/stats.js';

export let data;

function changeScope(e) {
  const newList = tournament.teams.slice(0, stage);
  if(!stats.report(newList, query).players.length) {
    if(!stats.report(newList, {species: pokemon}).players.length) {
      pokemon = '';
    }
    query = {species: pokemon};
  }
}

function clearScreen(e) {
  pokemon = '';
}

let { protocol, hostname, port, tournament } = data;
let pokemon = '';
let stage = tournament.teams.length;

$: teamList = tournament.teams.slice(0, stage);
$: pokemonList = stats.getPokemonList(teamList);
$: query = { species: pokemon };
$: results = !pokemon ? { players: teamList } : stats.report(teamList, query);
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
      <PokemonSelector
        pokemonList={pokemonList}
        bind:pokemon={pokemon}
    />
    {#if pokemon}
      <button
        on:click={clearScreen}
        class="secondary"
      >
        Reset
      </button>
    {/if}
  </div>
  {#if tournament.stages}
    <div>
      <label>
        Filter:
        <select bind:value={stage} on:change={changeScope}>
          {#each tournament.stages as stage}
            <option value={stage.count ?? tournament.teams.length}>{stage.name ? `${stage.name} (${stage.count} teams)` : `Top ${stage.count ?? tournament.teams.length}`}</option>
          {/each}
        </select>
      </label>
    </div>
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
