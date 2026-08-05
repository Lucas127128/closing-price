<script lang="ts">
  const {
    downloadOnClick,
    buttonText,
  }: { downloadOnClick: () => void; buttonText: string } = $props();
</script>

<button
  onclick={downloadOnClick}
  class="cursor-pointer border-[3px] border-emerald-300 overflow-hidden rounded-xl p-3 transition-[transform_0.3s_ease,border_0.2s_ease] hover:border-4 hover:transform-[perspective(350px)_translateZ(15px)] transform-gpu"
  >{buttonText}</button
>
