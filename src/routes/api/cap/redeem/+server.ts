import { validateChallenge } from 'capjs-core';
import { error } from '@sveltejs/kit';
import '../../../../../.svelte-kit/env.d.ts';
import { CAP_JS_SECRET } from '$app/env/private';
import type { RequestHandler } from './$types';
import { Temporal } from 'temporal-polyfill-lite';

export const POST: RequestHandler = async ({ request, platform }) => {
  const reqBody = (await request.json()) as {
    token: string;
    solutions: number[];
  };
  const D1 = platform?.env.CAP_JS_D1;
  if (!D1) return error(500, 'internal db error');
  const result = await validateChallenge(CAP_JS_SECRET, reqBody, {
    consumeNonce: async (sigHex, ttlMs) => {
      const expiresTime = Temporal.Now.zonedDateTimeISO()
        .add({
          seconds: Math.ceil(ttlMs / 1000),
        })
        .withTimeZone('UTC')
        .toPlainDateTime()
        .toJSON();

      const insertNoncesQuery = D1.prepare(
        'INSERT INTO cap_nonces (sig, expires_at) VALUES (?, ?)',
      );

      try {
        await insertNoncesQuery.bind(sigHex, expiresTime).run();
        return true;
      } catch {
        // sigHex is not unique
        return false;
      }
    },
  });
  if (result.success) {
    const expiresTime = Temporal.Now.zonedDateTimeISO()
      .add({
        seconds: 600,
      })
      .withTimeZone('UTC')
      .toPlainDateTime()
      .toJSON();
    const insertTokensQuery = D1.prepare(
      'INSERT INTO cap_tokens (token, expires_at) VALUES (?, ?)',
    );
    await insertTokensQuery.bind(result.token, expiresTime).run();
  }
  return Response.json(result);
};
