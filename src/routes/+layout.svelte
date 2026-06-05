<script>
import 'mvp.css';

import { onMount } from 'svelte';
import { beforeNavigate, afterNavigate } from '$app/navigation';
import { page } from '$app/state';

import Loading from './Loading.svelte';

import '$lib/css/app.css';
import { onBeforeNavigate } from '$lib/layers.js';

let { children } = $props();

let isLoading = $state(false);

beforeNavigate(onBeforeNavigate);
beforeNavigate((navigation) => {
  const isLeaving = navigation.to.route?.id === null;
  if (!isLeaving) {
    isLoading = true;
  }
});
afterNavigate(() => {isLoading = false});
</script>

{#if isLoading}
  <Loading />
{/if}
<main>
  {@render children?.()}
</main>
<footer>
  <p>
    {#if page.url.pathname !== '/credits' }
      <a href="/credits">
        Credits
      </a>
    {:else}
      <b>
        Credits
      </b>
    {/if}
  </p>
</footer>

