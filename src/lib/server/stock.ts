import { number, safeParse, array, object } from 'valibot';
import { error } from '@sveltejs/kit';
import { useLogger } from 'evlog/sveltekit';
// import pMemoize from 'p-memoize';
// import QuickLRU from 'quick-lru';

const PricesSchema = array(object({ price: number(), name: number() }));

const USER_AGENT = 'Mozilla/5.0 (compatible; closing-price/1.0)';
const cookieHeader = (cookies: Record<string, string>) =>
  Object.entries(cookies)
    .map(([key, value]) => `${key}=${value}`)
    .join('; ');

async function getCookies() {
  const url = 'https://finance.yahoo.com/quote/AAPL';
  const res = await fetch(url, {
    headers: {
      'User-Agent': USER_AGENT,
      accept: 'text/html,application/xhtml+xml,application/xml',
    },
    redirect: 'manual',
  });
  const location = res.headers.get('location');
  if (location === null) {
    return { fail: true, cookies: undefined };
  } else {
    const cookies = res.headers
      .getSetCookie()
      .reduce<Record<string, string>>((acc, cookieStr) => {
        const [pair] = cookieStr.split(';');
        // cookies value has = sign
        const [key, ...val] = pair.split('=');
        if (key) acc[key.trim()] = decodeURIComponent(val.join('='));
        return acc;
      }, {});
    return {
      fail: false,
      cookies: cookies,
    };
  }
}

async function getCrumb(cookies: Record<string, string>) {
  const res = await fetch(
    'https://query1.finance.yahoo.com/v1/test/getcrumb',
    {
      headers: {
        'User-Agent': USER_AGENT,
        origin: 'https://finance.yahoo.com',
        referer: 'https://finance.yahoo.com/quote/AAPL',
        accept: '*/*',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-US,en;q=0.9',
        'content-type': 'text/plain',
        cookie: cookieHeader(cookies),
      },
    },
  );
  if (res.ok) return (await res.text()).trim();
  return null;
}

// const memoizedGetCrumb = pMemoize(getCrumb, {
//   cache: new QuickLRU({ maxAge: 1000 * 60, maxSize: 500 }),
// });

export const getCurrentStockPrices = async (
  stocks: { symbol: string; name: number }[],
) => {
  const log = useLogger();
  const { fail, cookies } = await getCookies();
  if (fail) {
    log.error(new Error('Cannot get cookies'));
    return error(500, 'external service error: cannot get cookies');
  }

  const crumbValue = await getCrumb(cookies!);
  if (crumbValue === null) {
    log.error(new Error('Cannot get crumb'));
    return error(500, 'external service error: cannot get crumb');
  }
  const symbols = stocks.map(({ symbol }) => symbol).join(',');
  const url = `https://query2.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(symbols)}&crumb=${encodeURIComponent(crumbValue)}`;
  const response = await fetch(url, {
    headers: {
      'User-Agent': USER_AGENT,
      accept: '*/*',
      cookie: cookieHeader(cookies!),
    },
  });
  if (!response.ok) {
    log.error(new Error(`Yahoo Finance API responded ${response.status}`));
    log.set({ errorResponse: await response.json() });
    return error(500, 'external service error');
  }
  const { quoteResponse } = (await response.json()) as {
    quoteResponse?: {
      result?: { symbol: string; regularMarketPrice?: number }[];
    };
  };
  const { output, success, issues } = safeParse(
    PricesSchema,
    stocks.map(({ symbol, name }) => ({
      price: quoteResponse?.result?.find(
        (result) => result.symbol === symbol,
      )?.regularMarketPrice,
      name,
    })),
  );

  if (!success) {
    log.error(new Error('Failed to parse prices'));
    log.set({ pricesValidation: { issues } });
    return error(500, 'external service error');
  } else {
    return output;
  }
};
