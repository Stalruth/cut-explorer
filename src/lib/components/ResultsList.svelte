<script>
import { onMount } from 'svelte';
import {Icons} from '@pkmn/img';

export let protocol = '';
export let hostname = '';
export let port = '';
export let players = {};

const domain = port ? `${hostname}:${port}` : hostname;
let isExpanded = false;

$: isExpandable = !isExpanded && players.length > 16;

function expandResults(e) {
  isExpanded = true;
}

function getListingName(player) {
  let title = '';
  if(player.top === 1) {
    title = '1st';
  } else if (player.top === 2) {
    title = '2nd';
  } else {
    title = `Top ${player.top}`;
  }
  return `${title} ${player.name} (${player.swiss.wins}-${player.swiss.losses})`;
}

function getTeamDisplay(team) {
  if(team?.length === 6) {
    return team;
  }
  const display = [{}, {}, {}, {}, {}, {}];
  (team ?? []).forEach((el, i) => {
    display[i] = el;
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
      {#each getTeamDisplay(player.team) as set}
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
