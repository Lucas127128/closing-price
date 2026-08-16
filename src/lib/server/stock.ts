import { number, safeParse, array, object } from 'valibot';
import { error } from '@sveltejs/kit';

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

export const getCurrentStockPrices = async (
  stocks: { symbol: string; name: number }[],
) => {
  const { fail, cookies } = await getCookies();
  if (fail) return error(500, { message: 'external service error' });

  const crumbValue = await getCrumb(cookies!);
  const symbols = stocks.map(({ symbol }) => symbol).join(',');
  const url = `https://query2.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(symbols)}&crumb=${encodeURIComponent(crumbValue!)}`;
  console.log(cookies);
  const response = await fetch(url, {
    headers: {
      'User-Agent': USER_AGENT,
      accept: '*/*',
      cookie: cookieHeader(cookies!),
    },
  });
  if (!response.ok) {
    console.log(`Yahoo Finance API responded ${response.status}`);
    return error(500, { message: 'external service error' });
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
    console.log(issues);
    return error(500, { message: 'external service error' });
  } else {
    return output;
  }
};
