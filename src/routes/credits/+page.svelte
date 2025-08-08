<script lang="ts">
import { onClickHardBack } from '$lib/layers.js';
</script>

<svelte:head>
  <title>Credits - Top Cut Explorer</title>
  <meta property="og:title" content="Credits - Top Cut Explorer" />
  <meta property="og:url" content="https://cut-explorer.stalruth.dev/credits" />
  <meta property="og:description" content="Fine grained analytical tool for  Top Cut teams." />
  <meta name="description" content="Top Cut Explorer Credits and Acknowledgments" />
</svelte:head>

<nav>
  <div>
    <a href="/" onclick={onClickHardBack}>Back</a>
  </div>
</nav>

<h1>Credits</h1>

<dl>
  <dt>Programming and Design</dt>
  <dd><a href="https://stalruth.dev">Stuart Rutherford</a> (<a href="https://github.com/Stalruth/cut-explorer/">GitHub</a>)</dd>
  <dt>Data source</dt>
  <dd><a href="https://rk9.gg">RK9 Labs</a></dd>
  <dt>Team exports</dt>
  <dd><a href="https://twitter.com/VGCPastes">VGC Pastes</a></dd>
  <dt>Standings</dt>
  <dd><a href="https://standings.stalruth.dev/">Homemade Standings</a></dd>
  <dt>Pokémon Set Parsing and Sprites</dt>
  <dd><a href="https://github.com/pkmn/ps">pkmn/ps</a></dd>
  <dd><a href="https://play.pokemonshowdown.com">Pokémon Showdown</a></dd>
  <dt>Teamlist Hosting</dt>
  <dd><a href="https://pokepast.es/">PokePaste</a></dd>
  <dt>Favicon</dt>
  <dd><a href="https://github.com/twitter/twemoji">Twemoji by Twitter</a></dd>
  <dt>JavaScript Framework</dt>
  <dd><a href="https://kit.svelte.dev">SvelteKit</a></dd>
</dl>

