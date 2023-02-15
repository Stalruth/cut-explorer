<script>
import {Icons} from '@pkmn/img';

export let players = {};
</script>

<h2>Teams</h2>

<div class="teamlist">
  {#each players as player (player.swiss.place)}
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
          style={Icons.getPokemon(set.species, {scheme: "https", domain: "cut-explorer.stalruth.dev"}).style}
        >
        </span>
      {/each}
    </p>
  {/each}
</div>

<style>
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
