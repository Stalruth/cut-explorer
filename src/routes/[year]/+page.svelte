<script lang="ts">
import type { PageProps } from './$types';

import TournamentList from './TournamentList.svelte';
import { onClickBack } from '$lib/layers.js';

let { data }: PageProps = $props();
</script>

<svelte:head>
  <title>{ data.year } Top Cut Explorer</title>
  <meta property="og:title" content="{ data.year } Top Cut Explorer" />
  <meta property="og:url" content="https://cut-explorer.stalruth.dev/{ data.year }/" />
  <meta property="og:description" content="Fine grained analytical tool for VGC Top Cut teams." />
  <meta name="description" content="Fine grained analytical tool for VGC Top Cut teams." />
</svelte:head>

<nav>
  <div>
    <a href="/" onclick={onClickBack}>Index</a>
  </div>
</nav>

<h1>{ data.year } VGC Top Cut Explorer</h1>

<TournamentList tourInfo={data.tourInfo.formats} year={data.year} />

