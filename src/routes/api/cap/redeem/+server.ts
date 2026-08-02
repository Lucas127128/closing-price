import { validateChallenge } from 'capjs-core';
import { json } from '@sveltejs/kit';
import '../../../../../.svelte-kit/env.d.ts';
import { CAP_JS_SECRET } from '$app/env/private';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, platform }) => {
  return json(
    await validateChallenge(CAP_JS_SECRET, await request.json(), {
      consumeNonce: async (sigHex, ttlMs) => {
        if (!platform) return false;
        const { CAP_JS_KV } = platform.env;
        const key = `cap:${sigHex}`;
        if ((await CAP_JS_KV.get(key)) !== null) return false;
        await CAP_JS_KV.put(key, '1', {
          expirationTtl: Math.ceil(ttlMs / 1000),
        });
        return true;
      },
    }),
  );
};
