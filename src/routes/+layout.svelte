<script lang="ts">
  import { page } from '$app/state';
  import { CF_WEB_ANALYTICS_TOKEN } from '$app/env/public';
  import favicon from '#lib/assets/favicon.svg';
  import '../app.css';
  import {
    QueryClient,
    QueryClientProvider,
  } from '@tanstack/svelte-query';

  const { children } = $props();
  const cfBeacon = { token: CF_WEB_ANALYTICS_TOKEN };
  const queryClient = new QueryClient();
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

<QueryClientProvider client={queryClient}>
  {@render children()}
</QueryClientProvider>

<style>
  :global(body) {
    padding: 0;
    margin: 0;
  }
  :global(html) {
    background-color: #16171d;
    scrollbar-width: none;
  }
</style>
