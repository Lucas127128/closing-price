import { defineConfig } from 'vitest/config';
import adapter from '@sveltejs/adapter-cloudflare';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { comptime } from 'comptime/vite';

export default defineConfig({
  css: {
    transformer: 'lightningcss',
  },
  plugins: [
    comptime(),
    tailwindcss({ optimize: true }),
    sveltekit({
      compilerOptions: {
        // Force runes mode for the project, except for libraries. Can be removed in svelte 6.
        runes: ({ filename }) =>
          filename.split(/[/\\]/).includes('node_modules')
            ? undefined
            : true,
        experimental: { async: true },
      },
      adapter: adapter(),
      experimental: {
        remoteFunctions: true,
        handleRenderingErrors: true,
        forkPreloads: true,
        explicitEnvironmentVariables: true,
      },
    }),
  ],
});
