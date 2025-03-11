<script lang="ts">
import type { PageProps } from './$types';

import TournamentList from './[year]/TournamentList.svelte';

let { data }: PageProps = $props();
</script>

<svelte:head>
  <title>Top Cut Explorer</title>
  <meta property="og:title" content="Top Cut Explorer" />
  <meta property="og:url" content="https://cut-explorer.stalruth.dev/" />
  <meta property="og:description" content="Fine grained analytical tool for VGC Top Cut teams." />
  <meta name="description" content="Fine grained analytical tool for VGC Top Cut teams." />
</svelte:head>

<h1>VGC Top Cut Explorer</h1>
{#each data.years as year, i}
  {#if i != data.years.length - 1}
    <p>
      <a href="/{year}">{year} Top Cut Explorer</a>
    </p>
  {/if}
{/each}

<TournamentList year="2025" tourInfo={data.tourInfo} />

