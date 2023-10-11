<script>
import { onMount } from 'svelte';
import {Icons} from '@pkmn/img';

export let players = [];
export let query = {};
export let teammates = [];
export let protocol = '';
export let hostname = '';
export let port = '';

const domain = port ? `${hostname}:${port}` : hostname;
let isExpanded = false;

$: isExpandable = !isExpanded && players.length > 16;
$: species = getPresentItems(query.species)[0] ?? undefined;
$: queryTeammates = getPresentItems(query.teammates).reverse();
$: partners = teammates
    .filter(el => el.count === players.length)
    .map(el => el.name)
    .reverse()
    .sort((a, b) => queryTeammates.indexOf(a) - queryTeammates.indexOf(b));

function expandResults(e) {
  isExpanded = true;
}

function getPresentItems(queryMap) {
  if (!queryMap) {
    return [];
  }
  const results = [];
  for(let [item, present] of queryMap.entries()) {
    if (present) {
      results.push(item);
    }
  }
  return results.sort();
}

function getListingName(player) {
  let title = '';
  if(player.top === 1) {
    title = '1st';
  } else if (player.top === 2) {
    title = '2nd';
  } else if (player.top) {
    title = `Top ${player.top}`;
  }
  return `${title} ${player.name} (${player.swiss.wins}-${player.swiss.losses})`;
}

function getTeamDisplay(team, query) {
  const display = [{}, {}, {}, {}, {}, {}];
  (team ?? []).forEach((el, i) => {
    display[i] = el;
  });
  display.sort((a,b) => {
    if (!a.species) {
      return 1;
    }
    if (!b.species) {
      return -1;
    }

    if (a.species === species) {
      return -1;
    }
    if (b.species === species) {
      return 1;
    }

    return partners.indexOf(b.species) - partners.indexOf(a.species);
  });
  return display;
}
</script>

<h2>Teams</h2>

<div class="teamlist">
  {#each (isExpanded ? players : players.slice(0, 16)) as player (player.swiss.place)}
    <p>
      {#if player.paste}
        <a href={player.paste}>{getListingName(player)}</a>
      {:else}
        <b>{getListingName(player)}</b>
      {/if}
    </p>
    <p>
      {#each getTeamDisplay(player.team, query) as set}
        <span
          title={set.species ?? 'No Data'}
          style={Icons.getPokemon(set.species ?? 'No Data', {protocol: protocol, domain: domain}).style}
        >
        </span>
      {/each}
    </p>
  {/each}
</div>

{#if isExpandable}
  <button on:click={expandResults} class="secondary show-all">Show all teams</button>
{/if}
