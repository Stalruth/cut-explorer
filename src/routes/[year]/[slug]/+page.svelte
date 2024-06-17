<script>
import ReportView from './ReportView.svelte';
import ResultsList from './ResultsList.svelte';

import * as stats from '$lib/stats.js';
import sortRestricted from '$lib/sortRestricted.js';

export let data;

function changeScope(e) {
  const newList = tournament.teams.slice(0, stage);
  if(!stats.report(newList, query, equivalents).players.length) {
    if(!stats.report(newList, {species: new Map([[pokemon, true]])}, equivalents).players.length) {
      pokemon = '';
    }
    query = {species: new Map([[pokemon, true]])};
  }
}

function clearScreen(e) {
  pokemon = '';
}

let { tournament, equivalents, year } = data;
let pokemon = '';
let stage = tournament.teams.length;

$: teamList = tournament.teams.slice(0, stage);
$: pokemonList = stats.getPokemonList(teamList).sort((a,b) => sortRestricted(a.name, b.name) || stats.collationSorter(a,b));
$: query = {species: pokemon ? new Map([[pokemon, true]]) : undefined};
$: results = !pokemon ? { players: teamList } : stats.report(teamList, query, equivalents);
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
    <a href={year === "2024" ? "/" : `/${year}`}>Index</a>
  </div>
</nav>

<h1>{tournament.name} Top Cut Explorer</h1>

<div class="controlbar">
  <div class="pokemon-select">
      <select aria-label="Pokémon:" bind:value={pokemon}>
        <option value="" disabled selected>Select a Pokémon</option>
        {#each pokemonList as pokemon}
          <option value="{pokemon.name}">{pokemon.name} ({pokemon.count})</option>
        {/each}
      </select>
    {#if pokemon}
      <button on:click={clearScreen} class="secondary">
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
            <option value={stage.count ?? tournament.teams.length}>{stage.name ? `${stage.name} (${stage.count || tournament.teams.length} teams)` : `Top ${stage.count ?? tournament.teams.length}`}</option>
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
    equivalents={equivalents}
  />
{/if}

<ResultsList
  players={results.players}
  query={query}
  teammates={results?.sets?.teammates ?? []}
/>
