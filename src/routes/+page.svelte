<script lang="ts">
  import { onMount } from 'svelte';
  import { getQuotes, getCsv } from './stock.remote';
  import Cap from 'cap-widget';
  import { cleanupDB } from './cleanup.remote';
  import Button from '$lib/components/Button.svelte';
  import { Settings } from '@lucide/svelte';
  import Popup from '$lib/components/Popup.svelte';

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
    if (isBot === 'false') {
      getCsv(quotes)
        .then((csv) => {
          url = URL.createObjectURL(new Blob([csv]));
          loading = false;
        })
        .catch((err) => console.error(err));
    }
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
<main class="grid grid-rows-[3em_3em_3em_1fr] p-4 gap-6">
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
      <a href={url} download="closing-price.csv" class="text-white"
        ><Button onclick={downloadOnClick} {buttonText} /></a
      >
    {/if}
  </div>

  {let showStocks = $state(false)}
  <div class="flex justify-center">
    {let buttonText = $state('Show stocks')}
    <button
      class="min-w-56 bg-[#202f34] hover:bg-[oklab(0.7161_-0.141281_-0.00471642)] pl-4 pr-4 text-accent hover:text-black rounded-xl cursor-pointer"
      onclick={() => {
        showStocks = !showStocks;
        buttonText = showStocks ? 'Hide stocks' : 'Show stocks';
      }}>{buttonText}</button
    >
  </div>

  <div class="flex justify-center">
    {#if showLink}
      <p class="text-white">
        press <a
          href={url}
          download="closing-price.xlsx"
          class="text-white underline">here</a
        > if download doesn't start automatically
      </p>
    {/if}
  </div>

  <div
    class="grid grid-cols-[repeat(auto-fill,minmax(4em,1fr))] gap-4 p-9"
  >
    {#if showStocks}
      {#each quotes as { quote }}
        <span class="text-white">{quote}</span>
      {/each}
    {/if}
  </div>
</main>
