<script lang="ts">
  const {
    downloadOnClick,
    buttonText,
  }: { downloadOnClick: () => void; buttonText: string } = $props();
</script>

<button
  onclick={downloadOnClick}
  class="text-base text-white bg-inherit cursor-pointer border-[3px] hover:border-4 border-[rgb(66,245,179)] rounded-xl overflow-hidden p-[0.8em] transition-[transform_0.3s_ease,border_0.2s_ease] hover:transform-[perspective(350px)_translateZ(20px)]"
  >{buttonText}</button
>
