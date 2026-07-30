<script lang="ts">
  import { page } from '$app/state';
  import favicon from '$lib/assets/favicon.svg';
  import '../app.css';

  let { children } = $props();
  const cfBeacon = { token: 'f645554b80b243e58e72fa04955e2de6' };
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

<div>
  {@render children()}
</div>

<style>
  :global(body) {
    font-family: Arial, Helvetica, sans-serif;
    padding: 0;
    margin: 0;
  }
  div {
    display: grid;
    background-color: rgb(22, 23, 29);
    grid-template-rows: 4em calc(100dvh - 4em);
    gap: 1em;
    height: 100dvh;
    margin: 0;
    padding: 1em;
  }
</style>
