import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ setHeaders }) => {
  setHeaders({
    'Cache-Control': 'public, max-age=300, s-maxage=600',
  });
};
