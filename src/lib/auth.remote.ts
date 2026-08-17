import { SESSION_TOKEN, USER_PW_HASH } from '$app/env/private';
import { form, getRequestEvent, command } from '$app/server';
import { LoginSchema } from '#lib/schema.js';
import { redirect } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';

export const logout = command(() => {
  const { cookies } = getRequestEvent();
  cookies.delete('session-token', { path: '/' });
  cookies.delete('username', { path: '/' });
});

export const loginForm = form(
  LoginSchema,
  async ({ username, password, capToken }) => {
    const isLoggedIn = await bcrypt.compare(password, USER_PW_HASH);
    if (!isLoggedIn) return { fail: true, message: 'Invalid credentials' };
    const { cookies, platform } = getRequestEvent();

    const D1 = platform?.env.CAP_JS_D1;
    const tokensQuery = D1?.prepare('SELECT token FROM cap_tokens;');
    if (!tokensQuery) return { fail: true, message: 'Internal error' };
    const { results } = await tokensQuery.run();
    const token = results.find((r) => r.token === capToken);

    if (!token) return { fail: true, message: 'Invalid token' };

    cookies.set('session-token', SESSION_TOKEN, {
      secure: true,
      sameSite: 'strict',
      httpOnly: true,
      path: '/',
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7 * 4),
    });
    cookies.set('username', username, {
      secure: true,
      sameSite: 'strict',
      httpOnly: true,
      path: '/',
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7 * 4),
    });
    return redirect(307, '/');
  },
);
