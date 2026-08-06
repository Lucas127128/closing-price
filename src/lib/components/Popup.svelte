<script lang="ts">
  import { SymbolSchema } from '$lib/schema';
  import { safeParse } from 'valibot';
  let {
    popupId,
    quotes = $bindable(),
    loading = $bindable(),
  }: {
    popupId: string;
    quotes: {
      quote: string;
      name: number;
    }[];
    loading: boolean;
  } = $props();
  const stock = $state({ quote: '', name: '' });
</script>

<dialog
  id={popupId}
  class="fixed inset-0 m-auto p-6 w-lg bg-white dark:bg-[#1d232a] rounded-2xl overflow-y-auto overscroll-y-contain"
>
  <h2 class="pb-4 text-2xl justify-self-center">
    Add a stock temporarily
  </h2>
  <div class="grid grid-cols-[4em_1fr] grid-rows-[2.5em_2.5em] gap-4">
    <span class="text-lg self-center">Name</span>
    <input
      type="tel"
      placeholder="1"
      class="pr-3 pl-3 border-accent border outline-none rounded-sm min-w-20"
      bind:value={stock.name}
    />
    <span class="text-lg self-center">Symbol</span>
    <input
      type="text"
      placeholder="0001.HK"
      class="pr-3 pl-3 border-accent border outline-none rounded-sm min-w-20"
      bind:value={stock.quote}
    />
  </div>

  <div class="flex justify-end mt-6 gap-2">
    <button
      commandfor={popupId}
      command="close"
      class="bg-[#202f34] hover:bg-[oklab(0.7161_-0.141281_-0.00471642)] pl-4 pr-4 h-10 text-accent hover:text-[#084d49] text-sm font-semibold rounded-sm cursor-pointer"
      >Close</button
    >
    <button
      class="bg-accent hover:bg-[oklab(0.7161_-0.141281_-0.00471642)] pl-4 pr-4 h-10 text-[#084d49] text-sm font-semibold rounded-sm cursor-pointer"
      onclick={() => {
        const { output, success } = safeParse(SymbolSchema, {
          name: Number(stock.name),
          quote: stock.quote,
        });
        if (success) {
          loading = true;
          quotes.push(output);
          quotes.sort((a, b) => a.name - b.name);
          stock.name = '';
          stock.quote = '';
          document.querySelector('dialog')?.close();
        }
      }}>Add</button
    >
  </div>
</dialog>
