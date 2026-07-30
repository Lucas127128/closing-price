import { defineEnvVars } from '@sveltejs/kit/env';
import { string, pipe, minLength } from 'valibot';

export const variables = defineEnvVars({
  CAP_JS_SECRET: { schema: pipe(string(), minLength(64)), static: true },
});
