<script lang="ts">
  import { page } from '$app/state';
  import { CF_WEB_ANALYTICS_TOKEN } from '$app/env/public';
  import favicon from '$lib/assets/favicon.svg';
  import '../app.css';

  const { children } = $props();
  const cfBeacon = { token: CF_WEB_ANALYTICS_TOKEN };
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
  {#if page.url.hostname !== 'localhost'}
    <script
      type="module"
      src="https://static.cloudflareinsights.com/beacon.min.js"
      data-cf-beacon={JSON.stringify(cfBeacon)}
      async
    ></script>
  {/if}
</svelte:head>

<div
  class="font-[Arial,sans-serif] grid bg-[rgb(22,23,29)] grid-rows-[4em_calc(100dvh-4em)] justify-center gap-4 h-dvh p-4"
>
  {@render children()}
</div>

<style>
  :global(body) {
    padding: 0;
    margin: 0;
  }
</style>
