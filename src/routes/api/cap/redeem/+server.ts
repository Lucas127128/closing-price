import { validateChallenge } from 'capjs-core';
import { json } from '@sveltejs/kit';
import '../../../../../.svelte-kit/env.d.ts';
import { CAP_JS_SECRET } from '$app/env/private';
import type { RequestHandler } from './$types';
import { Temporal } from 'temporal-polyfill-lite';

export const POST: RequestHandler = async ({ request, platform }) => {
  return json(
    await validateChallenge(CAP_JS_SECRET, await request.json(), {
      consumeNonce: async (sigHex, ttlMs) => {
        if (!platform) return false;
        const { CAP_JS_D1 } = platform.env;
        const expiresTime = Temporal.Now.zonedDateTimeISO()
          .add({
            seconds: Math.ceil(ttlMs / 1000),
          })
          .toJSON();
        const insertQuery = CAP_JS_D1.prepare(
          'INSERT INTO cap_nonces (sig, expires_at) VALUES (?, ?)',
        );
        try {
          await insertQuery.bind(sigHex, expiresTime).run();
          return true;
        } catch {
          // sigHex is not unique
          return false;
        }
      },
    }),
  );
};
