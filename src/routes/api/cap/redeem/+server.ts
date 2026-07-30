import { validateChallenge } from 'capjs-core';
import { json } from '@sveltejs/kit';

export async function POST({ request, platform }) {
  return json(
    await validateChallenge(
      '1234567890123456789012345678901234567890',
      await request.json(),
      {
        consumeNonce: async (sigHex, ttlMs) => {
          if (!platform) return false;
          const { CAP_JS_KV } = platform.env;
          const key = `cap:${sigHex}`;
          console.log(ttlMs);
          if (await CAP_JS_KV.get(key)) return false;
          await CAP_JS_KV.put(key, '1', {
            expirationTtl: Math.ceil(ttlMs / 1000),
          });
          return true;
        },
      },
    ),
  );
}
