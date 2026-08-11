<script lang="ts">
  import { onMount } from 'svelte';
  import { getQuotes } from './stock.remote';
  import { cleanupDB } from './cleanup.remote';

  import Cap from 'cap-widget';

  import Settings from '@lucide/svelte/icons/settings';
  import Popup from '$lib/components/Popup.svelte';
  import DownloadButton from '$lib/components/DownloadButton.svelte';
  import { logout } from '$lib/auth.remote';
  import { goto } from '$app/navigation';

  let isBot = $state<'validating' | 'true' | 'false'>('validating');
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
</script>

<div
  class="font-[Arial,sans-serif] grid bg-[#16171d] grid-rows-[2em_2em_1fr] grid-cols-[100dvw] justify-center gap-4 min-h-dvh p-4"
>
  <div class="grid grid-rows-1 grid-cols-2 content-start">
    <button
      class="bg-white text-black justify-self-start ml-8 p-2 pt-1 rounded-sm cursor-pointer"
      onclick={async () => {
        await logout();
        await goto('/login');
      }}>Logout</button
    >
    <button
      commandfor="settings"
      command="show-modal"
      class="justify-self-end pr-8 cursor-pointer self-center"
      ><Settings color="white" /></button
    >
  </div>

  <Popup popupId="settings" bind:quotes />

  <h1 class="text-white font-extrabold place-self-center text-3xl">
    Closing Price Generator
  </h1>
  <main class="grid grid-rows-[3em_3em_1fr] p-4 gap-6">
    <div class="flex justify-center">
      <DownloadButton {quotes} {isBot} />
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
</div>
