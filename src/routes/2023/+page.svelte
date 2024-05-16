<script>
import TournamentList from './TournamentList.svelte';
</script>

<svelte:head>
  <title>2023 Top Cut Explorer</title>
  <meta property="og:title" content="Top Cut Explorer" />
  <meta property="og:url" content="https://cut-explorer.stalruth.dev/" />
  <meta property="og:description" content="Fine grained analytical tool for VGC Top Cut teams." />
  <meta name="description" content="Fine grained analytical tool for VGC Top Cut teams." />
</svelte:head>

<nav>
  <div>
    <a href="/">Index</a>
  </div>
</nav>

<h1>VGC Top Cut Explorer</h1>
<TournamentList />

