<script>
import { Icons } from '@pkmn/img';

import sortRestricted from '$lib/sortRestricted.js';

export let players = [];
export let query = {};
export let teammates = [];

let isExpanded = false;

$: isExpandable = !isExpanded && players.length > 16;

function expandResults(e) {
  isExpanded = true;
}

function getListingName(player) {
  let title = '';
  if (player.top === 1) {
    title = '1st';
  } else if (player.top === 2) {
    title = '2nd';
  } else if (player.top) {
    title = `Top ${player.top}`;
  }
  let record = `${player.swiss.wins}-${player.swiss.losses}`;
  if (player.swiss.ties) {
    record = `${record}-${player.swiss.ties}`;
  }
  return `${title} ${player.name} (${record})`;
}

function getPresentItems(queryMap) {
  return [...(queryMap?.keys() ?? [])].sort();
}

function getTeamDisplay(team) {
  const display = [{}, {}, {}, {}, {}, {}];
  const species = getPresentItems(query.species)[0] ?? undefined;
  const queryTeammates = getPresentItems(query.teammates);
  const partners = teammates
    .filter((el) => el.count === players.length)
    .map((el) => el.name)
    .sort((a, b) => queryTeammates.indexOf(a) - queryTeammates.indexOf(b));

  (team ?? []).forEach((el, i) => {
    display[i] = el;
  });
  display.sort((a,b) => {
    if (!a.species && !b.species) {
      return 0;
    } else if (!a.species) {
      return 1;
    } else if (!b.species) {
      return -1;
    }

    const restricted = sortRestricted(a.species, b.species);
    if (restricted) {
      return restricted;
    }

    if (a.species === species) {
      return -1;
    } else if (b.species === species) {
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
      {#each getTeamDisplay(player.team) as set}
        <span
          title={set.species ?? 'No Data'}
          style={Icons.getPokemon(set.species ?? 'No Data', {protocol: 'https', domain: 'cut-explorer.stalruth.dev'}).style}
        >
        </span>
      {/each}
    </p>
  {/each}
</div>

{#if isExpandable}
  <button on:click={expandResults} class="secondary show-all">Show all teams</button>
{/if}

