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
  <meta name="theme-color" content="#16171d" />
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
  class="font-[Arial,sans-serif] grid bg-[#16171d] grid-rows-[2em_2em_calc(100dvh-4em)] grid-cols-[100dvw] justify-center gap-4 min-h-dvh p-4"
>
  {@render children()}
</div>

<style>
  :global(body) {
    padding: 0;
    margin: 0;
  }
  :global(html) {
    background-color: #16171d;
  }
</style>
