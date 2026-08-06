<script lang="ts">
  import { SymbolSchema } from '$lib/schema';
  import { safeParse, transform } from 'valibot';
  let {
    popupId,
    quotes = $bindable(),
  }: {
    popupId: string;
    quotes: {
      quote: string;
      name: number;
    }[];
  } = $props();
  const stock = $state({ quote: '', name: '' });
</script>

<div class="modal transition-none" id={popupId} popover>
  <div
    class="bg-white dark:bg-[#1d232a] p-6 rounded-xl w-lg overflow-y-auto overscroll-y-contain"
  >
    <h2 class="pb-4 text-2xl justify-self-center">
      Add a stock temporarily
    </h2>
    <div class="grid grid-cols-[12em_1fr] grid-rows-[2.5em_2.5em] gap-4">
      <span class="text-lg">Name (eg. 1)</span>
      <input
        type="text"
        class="pr-3 pl-3 border-accent border outline-none rounded-sm"
        bind:value={stock.name}
      />
      <span class="text-lg">Symbol (eg. 0001.HK)</span>
      <input
        type="text"
        class="pr-3 pl-3 border-accent border outline-none rounded-sm"
        bind:value={stock.quote}
      />
    </div>

    <div class="flex justify-end mt-6 gap-2">
      <button
        popovertarget={popupId}
        popovertargetaction="hide"
        class="bg-[oklab(0.294636_-0.0165992_-0.0144382)] hover:bg-[oklab(0.7161_-0.141281_-0.00471642)] pl-4 pr-4 h-10 text-accent hover:text-[#084d49] text-sm font-semibold rounded-sm cursor-pointer"
        >Close</button
      >
      <button
        popovertarget={popupId}
        popovertargetaction="hide"
        class="bg-accent hover:bg-[oklab(0.7161_-0.141281_-0.00471642)] pl-4 pr-4 h-10 text-[#084d49] text-sm font-semibold rounded-sm cursor-pointer"
        onclick={() => {
          const { output, success } = safeParse(SymbolSchema, {
            name: Number(stock.name),
            quote: stock.quote,
          });
          if (success) {
            quotes.push(output);
            quotes.sort((a, b) => a.name - b.name);
          }
        }}>Apply settings</button
      >
    </div>
  </div>
</div>
