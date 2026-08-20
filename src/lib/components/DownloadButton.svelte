<script lang="ts">
  import { createQuery, createMutation } from '@tanstack/svelte-query';
  import { getCsv } from '../../routes/stock.remote';
  import { onDestroy } from 'svelte';

  const {
    quotes,
  }: {
    quotes: { quote: string; name: number }[];
  } = $props();

  // eslint-disable-next-line
  let buttonText = $state('Download Spreadsheet');
  let currentUrl = $state('');

  const query = createQuery(() => ({
    queryKey: ['csv', quotes],
    staleTime: 30 * 1000,
    queryFn: async () => {
      if (currentUrl) URL.revokeObjectURL(currentUrl);
      const url = URL.createObjectURL(new Blob([await getCsv(quotes)]));
      currentUrl = url;
      return url;
    },
    experimental_prefetchInRender: true,
  }));
  onDestroy(() => {
    if (currentUrl) URL.revokeObjectURL(currentUrl);
  });
</script>

{#if query.isPending}
  <span class="loading loading-spinner loading-md"></span>
{:else if query.isError}
  <span class="text-error">Internal error: {query.error.message}</span>
{:else}
  <a href={query.data} download="closing-price.csv" class="text-white">
    <button
      onclick={() => {
        setTimeout(() => {
          buttonText = '✅ Download Successfully';
        }, 150);
        setTimeout(() => {
          buttonText = 'Download Spreadsheet';
        }, 6000);
      }}
      class="min-w-56 cursor-pointer border-[3px] border-emerald-300 overflow-hidden rounded-2xl p-3 transition-[transform_0.3s_ease,border_0.2s_ease] hover:border-4 hover:transform-[perspective(350px)_translateZ(15px)] transform-gpu"
    >
      {buttonText}
    </button>
  </a>
{/if}
