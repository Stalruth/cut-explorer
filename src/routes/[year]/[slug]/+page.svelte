<script lang="ts">
import type { PageProps } from './$types';

import { SvelteMap } from 'svelte/reactivity';

import { Icons } from '@pkmn/img';

import getOrdinal from '$lib/getOrdinal.js';
import * as stats from '$lib/stats.js';
import sortRestricted from '$lib/sortRestricted.js';
import { onClickBack } from '$lib/layers.js';

import Detail from './Detail.svelte';
import TeamDialog from './TeamDialog.svelte';

let { data }: PageProps = $props();

let species = $state('');
let teraTypeQuery = $state(new SvelteMap());
let itemQuery = $state(new SvelteMap());
let abilityQuery = $state(new SvelteMap());
let moveQuery = $state(new SvelteMap());
let teammatesQuery = $state(new SvelteMap());
let stage = $state(data.tournament.teams.length);
let isExpanded = $state(false);
let dialogTitle = $state('');
let dialogTeam = $state([]);
let dialog = $state();

let teamList = $derived(data.tournament.teams.slice(0, stage));
let pokemonList = $derived(stats.getPokemonList(teamList, data.equivalents['species'])
    .sort((a,b) => sortRestricted(a.name, b.name) || stats.collationSorter(a,b)));
let query = $derived({
    species: species ? new Map([[species, true]]) : undefined,
    teraType: teraTypeQuery,
    ability: abilityQuery,
    moves: moveQuery,
    teammates: teammatesQuery,
    item: itemQuery
});
let results = $derived(!species ? { players: teamList } : stats.report(teamList, query, data.equivalents));
let sortedTeammates = $derived(results.sets?.teammates?.toSorted((a,b) => sortRestricted(a.name, b.name) || stats.collationSorter(a,b)));
let isExpandable = $derived(!isExpanded & results.players.length > 16);
let priorityPokemon = $derived([
    ...(results?.sets?.teammates?.filter(el => el.count === results.sets.total)?.map(el => el.name) ?? []),
    ...getPresentItems(query.teammates)
]);

function clearPartialQuery() {
  teraTypeQuery.clear();
  itemQuery.clear();
  abilityQuery.clear();
  moveQuery.clear();
  teammatesQuery.clear();
}

function changeScope(e) {
  const newList = data.tournament.teams.slice(0, stage);
  if(!stats.report(newList, query, data.equivalents).players.length) {
    clearPartialQuery();
    if(!stats.report(newList, {species: new Map([[species, true]])}, data.equivalents).players.length) {
      species = '';
    }
  }
}

function clearQuery() {
  species = '';
  clearPartialQuery();
}

function getListingName(player) {
  let record = `${player.swiss.wins}-${player.swiss.losses}`;
  if (player.swiss.ties) {
    record = `${record}-${player.swiss.ties}`;
  }
  return `${getOrdinal(player.top, false)} ${player.name} (${record})`;
}

function getPresentItems(queryMap) {
  const results = [];
  queryMap?.forEach((v, k) => {
    if(v) {
      results.push(k);
    }
  });
  return results;
}

function getTeamDisplay(team) {
  const categories = data.equivalents['species']?.['values'];
  const result = team.toSorted((a, b) => {
    const restricted = sortRestricted(a.species, b.species);
    if (restricted) {
      return restricted;
    }

    if (a.species === species ||
        categories?.[a.species] === species) {
      return -1;
    } else if (b.species === species ||
        categories?.[b.species] === species) {
      return 1;
    }

    return (
      priorityPokemon.findLastIndex(el =>
        el === b.species || el === categories?.[b.species]
      ) - priorityPokemon.findLastIndex(el =>
        el === a.species || el === categories?.[a.species]
      )
    );
  });

  while (result.length < 6) {
    result.push({});
  }

  return result;
}

function getPosition(set) {
  const spriteInfo = Icons.getPokemon(set.species ?? 'No Data', {
    protocol: 'https',
    domain: 'cut-explorer.stalruth.dev',
  });
  return `${spriteInfo.left}px ${spriteInfo.top}px`;
}

function expandTeams() {
  isExpanded = true;
}

function getPasteClickHandler(name, team) {
  return (e) => {
    if(!navigator.onLine) {
      e.preventDefault();
      dialogTitle = `${name}'s Team`;
      dialogTeam = team;
      dialog.showModal();
    }
  }
}
</script>

<svelte:head>
  <title>{data.tournament.name} - Top Cut Explorer</title>
  <meta property="og:title" content="{data.tournament.name} - Top Cut Explorer" />
  <meta property="og:url" content="https://cut-explorer.stalruth.dev/{data.year}/{data.tourId}" />
  <meta property="og:description" content="Fine grained analytical tool for the {data.tournament.name} Top Cut teams." />
  <meta name="description" content="Fine grained analytical tool for the {data.tournament.name} Top Cut teams." />
</svelte:head>

<nav>
  <div>
    <a href={data.year === "2026" ? "/" : `/${data.year}`} onclick={onClickBack}>Index</a>
  </div>
</nav>

<h1>{data.tournament.name} Top Cut Explorer</h1>

<div class="controlbar">
  <div class="pokemon-select">
    <select aria-label="Pokémon: " bind:value={species} onchange={clearPartialQuery}>
      <option value="" disabled selected>Select a Pokémon</option>
      {#each pokemonList as entry}
        <option value="{entry.name}">
          {entry.displayName ?? entry.name} ({entry.count})
        </option>
        {#if entry.children}
          {#each entry.children as child}
            <option value="{child.name}">
              {child.displayName ?? child.name} ({child.count})
            </option>
          {/each}
        {/if}
      {/each}
    </select>
    {#if species}
      <button onclick={clearQuery} class="secondary">
        Reset
      </button>
    {/if}
  </div>
  {#if data.tournament.stages}
    <div>
      <label>
        Filter:
        <select bind:value={stage} onchange={changeScope}>
          {#each data.tournament.stages as stage}
            <option value={stage.count ?? data.tournament.teams.length}>
              {stage.name ?
                `${stage.name} (${stage.count || data.tournament.teams.length} teams)` :
                `Top ${stage.count || data.tournament.teams.length}`
              }
            </option>
          {/each}
        </select>
      </label>
    </div>
  {/if}
</div>

{#if species}
  <h2>
    {species}
  </h2>

  <div class="report">

    <div>
      <Detail
        title="Tera Types"
        items={results.sets.teraType}
        bind:query={teraTypeQuery}
        total={results.sets.total}
        equivalents={data.equivalents.teraTypes}
      />
    </div>

    <div>
      <Detail
        title="Abilities"
        items={results.sets.ability}
        bind:query={abilityQuery}
        total={results.sets.total}
        equivalents={data.equivalents.ability}
      />
    </div>

    <div>
      <Detail
        title="Items"
        items={results.sets.item}
        bind:query={itemQuery}
        total={results.sets.total}
        equivalents={data.equivalents.item}
      />
    </div>

    <div>
      <Detail
        title="Moves"
        items={results.sets.moves}
        bind:query={moveQuery}
        total={results.sets.total}
        equivalents={data.equivalents.moves}
      />
    </div>

    <div>
      <Detail
        title="Teammates"
        items={sortedTeammates}
        bind:query={teammatesQuery}
        total={results.sets.total}
        equivalents={data.equivalents.teammates}
      />
    </div>

  </div>
{/if}

<h2>Teams</h2>

<div class="teamlist">
  {#each results.players.slice(0, isExpanded ? undefined : 16) as player (player.swiss.place)}
    <p>
      {#if player.paste}
        <a href={`https://pokepast.es/${player.paste}`} onclick={getPasteClickHandler(player.name, player.team)}>
          {getListingName(player)}
        </a>
      {:else}
        <b>
          {getListingName(player)}
        </b>
      {/if}
    </p>
    <p>
      {#each getTeamDisplay(player.team ?? []) as set}
        <img
          src="/sprites/pokemonicons-sheet.png"
          alt={set.species ?? 'No Data'}
          title={set.species ?? 'No Data'}
          class="pokemon-icon"
          style={`object-position: ${getPosition(set)}`}
          width="40"
          height="30"
        >
      {/each}
    </p>
  {/each}
</div>

{#if isExpandable}
  <button onclick={expandTeams} class="secondary show-all">
    Show all teams
  </button>
{/if}

<TeamDialog bind:dialog title={dialogTitle} team={dialogTeam} />

<style>
.controlbar select {
  display: inline-block;
}

.controlbar {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}

.pokemon-select {
  display: flex;
  column-gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

.report {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 50px;
}

.report > div {
  flex-grow: 1;
  flex-basis: 30%;
  min-width: max-content;
}

.teamlist {
  display: grid;
  justify-content: space-around;
}

.teamlist > p {
  margin: 0;
  width: fit-content;
  text-align: center;
  justify-self: center;
}

.pokemon-icon {
  object-fit: none;
}

button.show-all {
  margin: 0 auto;
  display: block;
}

@media(min-width: 45rem) {
  .teamlist {
    grid-template-columns: repeat(2, max-content);
  }

  .teamlist > p {
    justify-self: start;
  }
}

</style>
