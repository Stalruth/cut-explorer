<script lang="ts">
let { dialog=$bindable(), title, team } = $props();
</script>

<dialog bind:this={dialog}>
  <nav>
    <form method="dialog">
      <button>Close</button>
    </form>
  </nav>
  <h1>
    {title}
  </h1>

  {#each team as set}
    <p>
      {set.species}
      {#if set.item}
        @ {set.item}
      {/if}
      <br>
      Ability: {set.ability}<br>
      Tera Type: {set.teraType}<br>
      {#each set.moves as move}
      - {move}<br>
      {/each}
    </p>
  {/each}
</dialog>

<style>
dialog {
  animation: none;
  color-scheme: light dark;
  padding: 1rem;
  width: auto;
}

form {
  border: none;
  box-shadow: none;
  padding: 0;
}

button {
  margin: 0;
  background-color: transparent;
  color: var(--color-link);
  text-decoration: underline;
}

button::before {
  content: '← ' / '';
}
</style>
