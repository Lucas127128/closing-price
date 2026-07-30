import { defineEnvVars } from '@sveltejs/kit/env';
import { type } from 'arktype';

export const variables = defineEnvVars({
  CAP_JS_SECRET: { schema: type('string >= 64'), static: true },
});
