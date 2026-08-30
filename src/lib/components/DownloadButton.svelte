<script lang="ts">
  import type { CreateMutationResult } from '@tanstack/svelte-query';

  const {
    csvUrl,
  }: {
    csvUrl: CreateMutationResult<
      string,
      Error,
      {
        quote: string;
        name: number;
      }[],
      unknown
    >;
  } = $props();

  // eslint-disable-next-line
  let buttonText = $state('Download Spreadsheet');
</script>

{#if csvUrl.isPending}
  <span class="loading loading-spinner loading-md"></span>
{:else if csvUrl.isError}
  <span class="text-error">Internal error: {csvUrl.error.message}</span>
{:else}
  <a href={csvUrl.data} download="closing-price.csv" class="text-white">
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
