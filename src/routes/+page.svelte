<script lang="ts">
  import { onMount } from 'svelte';
  import { getQuotes } from './stock.remote';
  import Cap from 'cap-widget';
  import { cleanupDB } from './cleanup.remote';
  import Button from '$lib/Button.svelte';

  let isBot = $state<'validating' | 'true' | 'false'>('validating');
  onMount(async () => {
    const cap = new Cap({ apiEndpoint: '/api/cap' });
    Promise.resolve()
      .then(() => cleanupDB())
      .catch((err) => console.error(err));
    const { token, success } = await cap.solve();
    isBot = success ? 'false' : 'true';
  });

  const quotes = await getQuotes();
  let fetching = $state(true);

  $effect(() => {
    if (isBot === 'false')
      fetch('/api/stockPrice', {
        method: 'POST',
        body: JSON.stringify(quotes),
      })
        .then((response) => response.blob())
        .then((blob) => {
          url = URL.createObjectURL(blob);
          fetching = false;
        })
        .catch((err) => console.error(err));
  });

  let url = $state<string>('');
  let buttonText = $state('Download Spreadsheet');
  let showLink = $state(false);
  const downloadOnClick = () => {
    setTimeout(() => {
      showLink = true;
      buttonText = '✅ Download Successfully';
    }, 150);
    setTimeout(() => {
      showLink = false;
      buttonText = 'Download Spreadsheet';
    }, 6000);
  };
</script>

<h1 class="text-white font-extrabold justify-self-center">
  Closing Price Generator
</h1>
<main class="grid place-content-center grid-rows-[3em_1fr] p-4 gap-4">
  <div class="flex justify-center">
    {#if fetching}
      <span class="loading loading-spinner loading-md"></span>
    {:else if isBot === 'true'}
      <p>
        You are detected as bot. Please <a href="/">reload</a> to try again
      </p>
    {:else}
      <a href={url} download="closing-price.xlsx" class="text-white"
        ><Button {downloadOnClick} {buttonText} /></a
      >
    {/if}
  </div>

  <div class="flex justify-center">
    {#if showLink}
      <p class="text-white">
        press <a
          href={url}
          download="closing-price.xlsx"
          class="text-white underline decoration-white">here</a
        > if download doesn't start automatically
      </p>
    {/if}
  </div>
</main>
