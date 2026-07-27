<script lang="ts">
  import { getQuotes } from './stock.remote';
  const quotes = await getQuotes();
  let fetching = $state(true);
  $effect(() => {
    fetch('/api/stockPrice', {
      method: 'POST',
      body: JSON.stringify(quotes),
    })
      .then((response) => {
        return response.arrayBuffer();
      })
      .then((buffer) => {
        url = URL.createObjectURL(new Blob([buffer]));
        fetching = false;
      })
      .catch((err) => console.error(err));
  });

  let url = $state<string>('');
  let buttonText = $state<string>('Download Spreadsheet');
  let showLink = $state<boolean>(false);
</script>

<h1>Closing Price Generator</h1>
<main>
  <div>
    {#if !fetching}
      <a href={url} download="closing-price.xlsx"
        ><button
          onclick={() => {
            setTimeout(() => {
              showLink = true;
              buttonText = '✅ Download Successfully';
            }, 150);
            setTimeout(() => {
              showLink = false;
              buttonText = 'Download Spreadsheet';
            }, 6000);
          }}>{buttonText}</button
        ></a
      >
    {:else}
      <span class="loading loading-spinner loading-md"></span>
    {/if}
  </div>

  <div>
    {#if showLink}
      <p>
        press <a href={url} download="closing-price.xlsx">here</a> if download
        doesn't start automatically
      </p>
    {/if}
  </div>
</main>

<style>
  h1 {
    color: white;
    font-weight: 800;
    justify-self: center;
  }
  main {
    display: grid;
    place-content: center;
    grid-template-rows: 3em 1fr;
    padding: 1em;
    gap: 1em;
  }
  div {
    display: flex;
    justify-content: center;
  }
  button {
    color: white;
    background-color: inherit;
    cursor: pointer;
    border: 3px solid rgb(66, 245, 179);
    border-radius: 0.7em;
    overflow: hidden;
    padding: 0.8em;
    transition:
      transform 0.3s ease,
      border 0.2s ease;
  }
  button:hover {
    transform: perspective(350px) translateZ(20px);
    border: 4px solid rgb(66, 245, 179);
  }
  a {
    text-decoration: none;
    color: white;
  }
  p {
    color: white;
    a {
      text-decoration: underline;
      color: white;
    }
  }
</style>
