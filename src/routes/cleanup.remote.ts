import { command, getRequestEvent } from '$app/server';
import { error } from '@sveltejs/kit';

export const cleanupDB = command(async () => {
  const { platform } = getRequestEvent();
  const D1 = platform?.env.CAP_JS_D1;
  if (!D1) error(500, 'internal db error');
  await D1.batch([
    D1.prepare(
      'DELETE FROM cap_nonces WHERE datetime("now") > datetime(expires_at);',
    ),
    D1.prepare(
      'DELETE FROM cap_tokens WHERE datetime("now") > datetime(expires_at);',
    ),
  ]);
});
