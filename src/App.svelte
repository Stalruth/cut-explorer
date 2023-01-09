<script>
import PokemonSelector from './components/PokemonSelector.svelte';
import ReportView from './components/ReportView.svelte';

import * as stats from './lib/stats.js';
import teamList from './lib/sanDiegoTeams.json';

function mergeQuery(species, partial) {
  if(species === partial.species) {
    return partial;
  }
  return { species };
}

let pokemon = '';
let partialQuery = {};

$: query = mergeQuery(pokemon, partialQuery);
$: results = stats.report(teamList, query);
</script>

<main>
  <h1>San Diego Top Cut Explorer</h1>
  <PokemonSelector
    pokemonList={stats.getPokemonList(teamList)}
    bind:pokemon={pokemon}
  />
  {#if pokemon}
    <ReportView
      bind:query={query}
      results={results}
    />
  {/if}
</main>

<style>
</style>
