import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { SESSION_TOKEN } from '$app/env/private';

export const load: PageServerLoad = ({ setHeaders, cookies }) => {
  const sessionToken = cookies.get('session-token');
  const isLoggedIn = sessionToken === SESSION_TOKEN;
  if (!isLoggedIn) redirect(307, '/login');

  setHeaders({
    'Cache-Control': 'public, max-age=300, s-maxage=600',
  });
};
