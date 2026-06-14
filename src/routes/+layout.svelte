<script>
import 'mvp.css';

import { onMount } from 'svelte';
import { beforeNavigate, afterNavigate } from '$app/navigation';
import { page } from '$app/state';

import '$lib/css/app.css';
import { onBeforeNavigate } from '$lib/layers.js';
import { getLoading, startLoading, stopLoading } from '$lib/loadingState.svelte.js';

let { children } = $props();

beforeNavigate(onBeforeNavigate);
beforeNavigate((navigation) => {
  const isLeaving = navigation.to.route?.id === null;
  if (!isLeaving) {
    startLoading();
  }
});
afterNavigate(stopLoading);
</script>

{#if getLoading()}
  <div class="loading">
    <p></p>
  </div>
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

