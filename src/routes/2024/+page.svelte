<script>
import TournamentList from './TournamentList.svelte';
import { onClickBack } from '$lib/layers.js';
</script>

<svelte:head>
  <title>2024 Top Cut Explorer</title>
  <meta property="og:title" content="2024 Top Cut Explorer" />
  <meta property="og:url" content="https://cut-explorer.stalruth.dev/2024/" />
  <meta property="og:description" content="Fine grained analytical tool for VGC Top Cut teams." />
  <meta name="description" content="Fine grained analytical tool for VGC Top Cut teams." />
</svelte:head>

<nav>
  <div>
    <a href="/" on:click={onClickBack}>Index</a>
  </div>
</nav>

<h1>VGC Top Cut Explorer</h1>
<TournamentList />

