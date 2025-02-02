<script>
import 'mvp.css';

import { onMount } from 'svelte';
import { beforeNavigate } from '$app/navigation';

import { pwaInfo } from 'virtual:pwa-info';

import '$lib/css/app.css';
import { onBeforeNavigate } from '$lib/layers.js';

beforeNavigate(onBeforeNavigate);

onMount(async () => {
  if (pwaInfo) {
    const { registerSW } = await import('virtual:pwa-register');
    registerSW({
      immediate: true,
    });
  }
});
</script>

<main>
<slot></slot>
</main>
<footer>
  <details>
    <summary>Credits</summary>
    <dl>
      <dt>Programming and Design</dt>
      <dd><a href="https://stalruth.dev">Stuart Rutherford</a> (<a href="https://github.com/Stalruth/cut-explorer/">GitHub</a>)</dd>
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
  </details>
</footer>
