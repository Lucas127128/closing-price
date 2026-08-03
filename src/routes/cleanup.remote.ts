import { command, getRequestEvent } from '$app/server';

export const cleanupDB = command(async () => {
  const { platform } = getRequestEvent();
  await platform?.env.CAP_JS_D1.prepare(
    'DELETE FROM cap_nonces WHERE datetime("now") > datetime(expires_at);',
  ).run();
});
