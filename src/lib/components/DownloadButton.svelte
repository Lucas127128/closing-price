<script lang="ts">
  import { getCsv } from '../../routes/stock.remote';

  const {
    quotes,
  }: {
    quotes: { quote: string; name: number }[];
  } = $props();

  // eslint-disable-next-line
  let buttonText = $state('Download Spreadsheet');
</script>

<svelte:boundary>
  {const url = $derived(
    URL.createObjectURL(new Blob([await getCsv(quotes)])),
  )}
  {#snippet pending()}
    <span class="loading loading-spinner loading-md"></span>
  {/snippet}
  {#if $effect.pending()}
    <span class="loading loading-spinner loading-md"></span>
  {:else}
    <a href={url} download="closing-price.csv" class="text-white"
      ><button
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
      </button></a
    >
  {/if}
</svelte:boundary>
