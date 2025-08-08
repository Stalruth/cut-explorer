<script>
import 'mvp.css';

import { onMount } from 'svelte';
import { beforeNavigate } from '$app/navigation';
import { page } from '$app/state';

import '$lib/css/app.css';
import { onBeforeNavigate } from '$lib/layers.js';

beforeNavigate(onBeforeNavigate);
</script>

<main>
<slot></slot>
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
