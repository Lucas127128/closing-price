<script lang="ts">
  let progress = $state(0);
  const id = setInterval(() => {
    progress += 0.6666;
    if (progress >= 100) {
      clearInterval(id);
    }
  }, 100);
</script>

<div>
  <span class="loading loading-spinner loading-lg"></span>
  <progress class="progress w-lg" value={progress} max="100"></progress>
</div>

<style>
  div {
    display: grid;
    grid-template-rows: 1fr 1fr;
    align-items: center;
  }
</style>
