<script lang="ts">
  import favicon from '$lib/assets/favicon.svg';
  import '../app.css';

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
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
