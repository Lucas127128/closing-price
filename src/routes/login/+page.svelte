<script>
  import { LoginSchema } from '#lib/schema.js';
  import { loginForm } from '#lib/auth.remote.js';
  import { onMount } from 'svelte';
  import Cap from 'cap-widget';
  import { cleanupDB } from '../cleanup.remote';

  let validated = $state(false);
  let capToken = $state('');

  onMount(async () => {
    const cap = new Cap({ apiEndpoint: '/api/cap' });
    Promise.resolve()
      .then(() => cleanupDB())
      .catch((err) => console.error(err));
    const { token, success } = await cap.solve();
    capToken = token;
    validated = success;
  });
</script>

<div
  class="p-8 h-dvh w-dvw grid grid-rows-[3em_1fr] grid-cols-[85dvw] justify-center gap-4"
>
  <h1 class="text-3xl justify-self-center">Login</h1>

  {#if !validated}
    <span class="loading loading-spinner loading-md"></span>
  {:else}
    <main
      class="bg-white rounded-3xl overflow-hidden p-6 dark:bg-[#1d232a]"
    >
      <form
        {...loginForm.preflight(LoginSchema)}
        oninput={() => loginForm.validate()}
      >
        <div class="grid grid-rows-[5em_5em_3em_2em] gap-5">
          <label
            class="text-black dark:text-white grid grid-cols-[5em_1fr] grid-rows-[3em_2em] items-center"
          >
            <span>Username:</span>
            <input
              {...loginForm.fields.username.as('text')}
              class="bg-inherit border-accent border outline-none p-2 rounded-sm ml-4 min-w-40"
              class:border-error={loginForm.fields.username.issues()}
              placeholder="Username"
              autocomplete="username"
              oninput={() => loginForm.validate()}
            />
            <div class="col-span-2">
              {#each loginForm.fields.username.issues() as issue}
                <p class="text-error p-0">{issue.message}</p>
              {/each}
            </div>
          </label>

          <label
            class="text-black dark:text-white grid grid-cols-[5em_1fr] grid-rows-[3em_2em] items-center"
          >
            <span>Password:</span>
            <input
              {...loginForm.fields.password.as('password')}
              class="bg-inherit border-accent border outline-none p-2 rounded-sm ml-4 min-w-40"
              class:border-error={loginForm.fields.password.issues()}
              placeholder="Password"
              type="password"
              autocomplete="current-password"
              oninput={() => loginForm.validate()}
            />
            <div class="col-span-2">
              {#each loginForm.fields.password.issues() as issue}
                <p class="text-error">{issue.message}</p>
              {/each}
            </div>
          </label>
          <input {...loginForm.fields.capToken.as('hidden', capToken)} />

          <button
            class="justify-self-end bg-accent text-[#084d49] p-2 pr-6 pl-6 rounded-md cursor-pointer hover:bg-[oklab(0.7161_-0.141281_-0.00471642)]"
            type="submit"
            >Login
          </button>

          <div>
            {#if loginForm.result?.fail}
              <p class="text-error">Username or password is incorrect</p>
            {/if}
          </div>
        </div>
      </form>
    </main>
  {/if}
</div>
