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
</script>

<h2>Teams</h2>

<div class="teamlist">
  {#each (isExpanded ? players : players.slice(0, 16)) as player (player.swiss.place)}
    <p>
      <a href={player.paste}>
        {#if player.top === 1}
          1st
        {:else if player.top === 2}
          2nd
        {:else if player.top}
          Top {player.top}
        {/if}
        {player.name}
        ({player.swiss.wins}-{player.swiss.losses})
      </a>
    </p>
    <p>
      {#each player.team as set}
        <span
          title={set.species}
          style={Icons.getPokemon(set.species, {protocol: protocol, domain: domain}).style}
        >
        </span>
      {/each}
    </p>
  {/each}
</div>

{#if isExpandable}
  <button on:click={expandResults}>Show all teams</button>
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
  width: max-content;
  justify-self: center;
}

@media(min-width: 40rem) {
  div.teamlist {
    grid-template-columns: repeat(2, max-content);
  }

  p {
    justify-self: start;
  }
}
</style>
