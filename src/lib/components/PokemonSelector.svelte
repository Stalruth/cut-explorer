<script>
export let pokemonList = [];
export let pokemon = '';
</script>

<select aria-label="Pokémon:" bind:value={pokemon}>
    <option value="" disabled selected>Select a Pokémon</option>
  {#each pokemonList as pokemon}
    <option value="{pokemon.name}">{pokemon.name} ({pokemon.count})</option>
  {/each}
</select>

