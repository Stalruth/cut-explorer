<script>
import { onMount } from 'svelte';
import {Icons} from '@pkmn/img';

export let protocol = '';
export let hostname = '';
export let port = '';
export let players = {};
export let query = {};

const domain = port ? `${hostname}:${port}` : hostname;
let isExpanded = false;

$: isExpandable = !isExpanded && players.length > 16;
$: species = getPresentItems(query.species)[0] ?? undefined;
$: teammates = getPresentItems(query.teammates).reverse();

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

    return teammates.indexOf(b.species) - teammates.indexOf(a.species);
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
  <button on:click={expandResults} class="secondary">Show all teams</button>
{/if}

<style>
button {
  margin: 0 auto;
  display: block;
}

div.teamlist {
  display: grid;
  justify-content: space-around;
}

p {
  margin: 0;
  width: fit-content;
  text-align: center;
  justify-self: center;
}

@media(min-width: 45rem) {
  div.teamlist {
    grid-template-columns: repeat(2, max-content);
  }

  p {
    justify-self: start;
  }
}
</style>
