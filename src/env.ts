import { defineEnvVars } from '@sveltejs/kit/env';
import { string, pipe, length } from 'valibot';

export const variables = defineEnvVars({
  CAP_JS_SECRET: { schema: pipe(string(), length(64)), static: true },
  USER_PW_HASH: { schema: string(), static: true },
  SESSION_TOKEN: { schema: string(), static: true },
  CF_WEB_ANALYTICS_TOKEN: {
    schema: pipe(string(), length(32)),
    static: true,
    public: true,
  },
});
