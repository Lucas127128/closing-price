<script lang="ts">
  import { onMount } from 'svelte';
  import { getQuotes } from './stock.remote';
  import Cap from 'cap-widget';
  import { cleanupDB } from './cleanup.remote';
  import Button from '$lib/Button.svelte';
  import { Settings } from '@lucide/svelte';
  import Popup from '$lib/Popup.svelte';

  let isBot = $state<'validating' | 'true' | 'false'>('validating');
  let loading = $state(true);
  let url = $state<string>('');
  let buttonText = $state('Download Spreadsheet');
  let showLink = $state(false);
  // eslint-disable-next-line
  let quotes = $state(await getQuotes());

  onMount(async () => {
    const cap = new Cap({ apiEndpoint: '/api/cap' });
    Promise.resolve()
      .then(() => cleanupDB())
      .catch((err) => console.error(err));
    const { token, success } = await cap.solve();
    isBot = success ? 'false' : 'true';
  });

  $effect(() => {
    if (isBot === 'false')
      fetch('/api/stockPrice', {
        method: 'POST',
        body: JSON.stringify(quotes),
      })
        .then((response) => response.blob())
        .then((blob) => {
          url = URL.createObjectURL(blob);
          loading = false;
        })
        .catch((err) => console.error(err));
  });

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

<button
  commandfor="settings"
  command="show-modal"
  class="justify-self-end pr-8 pt-2.5 cursor-pointer"
  ><Settings color="white" /></button
>
<Popup popupId="settings" bind:quotes bind:loading />

<h1 class="text-white font-extrabold place-self-center text-3xl">
  Closing Price Generator
</h1>
<main
  class="justify-self-center grid place-content-center grid-rows-[3em_1fr] p-4 gap-6 w-sm"
>
  <div class="flex justify-center">
    {#if loading}
      <span class="loading loading-spinner loading-md"></span>
    {:else if isBot === 'true'}
      <p>
        You are detected as bot. Please <a href="/" class="underline"
          >reload</a
        > to try again
      </p>
    {:else}
      <a href={url} download="closing-price.xlsx" class="text-white"
        ><Button {downloadOnClick} {buttonText} /></a
      >
    {/if}
  </div>

  <div class="flex justify-center">
    <p class="text-white" hidden={!showLink}>
      press <a
        href={url}
        download="closing-price.xlsx"
        class="text-white underline">here</a
      > if download doesn't start automatically
    </p>
  </div>
</main>
