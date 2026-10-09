<script lang="ts">
  import { getQuotes } from './stock.remote';
  import Settings from '@lucide/svelte/icons/settings';
  import Popup from '#lib/components/Popup.svelte';
  import DownloadButton from '#lib/components/DownloadButton.svelte';
  import { logout } from '#lib/auth.remote.js';
  import { goto } from '$app/navigation';

  import { createQuery } from '@tanstack/svelte-query';
  import { onDestroy } from 'svelte';
  import { getStockPrice, getTimeString } from './stock.remote';

  import { writeCsv } from 'hucre/csv';

  let currentUrl = $state('');
  let previousQuotes: { quote: string; name: number }[] = $state([]);
  let currentPrices = $state<{ price: number; name: number }[]>([]);

  // eslint-disable-next-line
  let quotes = $state(await getQuotes());

  const csvUrl = createQuery(() => ({
    queryKey: ['csvUrl', quotes],
    staleTime: 30 * 1000,
    queryFn: async () => {
      if (currentUrl) URL.revokeObjectURL(currentUrl);
      const toAddQuotes = quotes.filter(
        (item) => !currentPrices.find((quote) => quote.name === item.name),
      );
      const toRemoveQuotes = previousQuotes.filter(
        (item) => !quotes.find((quote) => quote.name === item.name),
      );
      const prices = currentPrices.filter(
        (price) =>
          !toRemoveQuotes.find(
            (toRemoveQuote) => toRemoveQuote.name === price.name,
          ),
      );
      if (toAddQuotes.length > 0) {
        const toAddedPrices = await getStockPrice(toAddQuotes);
        for (const toAddedPrice of toAddedPrices) {
          prices.push(toAddedPrice);
        }
        prices.sort((a, b) => a.name - b.name);
      }

      previousQuotes = [...quotes];
      currentPrices = [...prices];
      const time = await getTimeString();
      const data = prices.map((price, index) => {
        if (index === 0) {
          return [price.name, price.price, time];
        } else {
          return [price.name, price.price];
        }
      });
      data.unshift(['symbol', 'price', 'time']);
      const csv = '\u00EF\u00BB\u00BF' + writeCsv(data);
      const url = URL.createObjectURL(new Blob([csv]));
      currentUrl = url;
      return url;
    },
    experimental_prefetchInRender: true,
  }));

  onDestroy(() => {
    if (currentUrl) URL.revokeObjectURL(currentUrl);
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

  <Popup popupId="settings" {csvUrl} {quotes} />

  <h1 class="text-white font-extrabold place-self-center text-3xl">
    Closing Price Generator
  </h1>
  <main class="grid grid-rows-[3em_3em_1fr] p-4 gap-6">
    <div class="flex justify-center">
      <DownloadButton {csvUrl} />
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
