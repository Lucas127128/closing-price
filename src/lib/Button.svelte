<script lang="ts">
  const {
    downloadOnClick,
    buttonText,
  }: { downloadOnClick: () => void; buttonText: string } = $props();
</script>

<button
  onclick={downloadOnClick}
  class="text-base text-white bg-inherit cursor-pointer border-[3px] border-emerald-300 rounded-xl overflow-hidden p-3 transition-[transform_0.3s_ease,border_0.2s_ease] hover:border-4 hover:transform-[perspective(350px)_translateZ(15px)]"
  >{buttonText}</button
>
