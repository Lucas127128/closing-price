import { createEvlogHooks } from 'evlog/sveltekit';
import { createUserAgentEnricher } from 'evlog/enrichers';

export const { handle, handleError } = createEvlogHooks({
  enrich: (ctx) => {
    createUserAgentEnricher()(ctx);
  },
});
