import { number, safeParse, array, object } from 'valibot';
import { error } from '@sveltejs/kit';

const PricesSchema = array(object({ price: number(), name: number() }));

const USER_AGENT = 'Mozilla/5.0 (compatible; closing-price/1.0)';

const CRUMB_URL = 'https://query1.finance.yahoo.com/v1/test/getcrumb';
const QUOTE_URL = 'https://query2.finance.yahoo.com/v7/finance/quote';

let cookies = new Map<string, string>();
let crumb: string | undefined;

const sleep = async (ms: number) =>
  await new Promise((resolve) => setTimeout(resolve, ms));

const cookieHeader = () =>
  [...cookies].map(([key, value]) => `${key}=${value}`).join('; ');

function extractCookies(headers: Headers): void {
  const withGetSetCookie = headers as Headers & {
    getSetCookie?: () => string[];
  };
  const raw = withGetSetCookie.getSetCookie();
  for (const header of raw.filter(Boolean)) {
    for (const part of header.split(',')) {
      const pair = part.trim().split(';')[0];
      const sep = pair.indexOf('=');
      if (sep > 0)
        cookies.set(pair.slice(0, sep).trim(), pair.slice(sep + 1).trim());
    }
  }
}

async function acquireCookies(): Promise<void> {
  if (cookies.has('A1') && cookies.has('A3')) return;
  let url = 'https://finance.yahoo.com/quote/AAPL';
  for (let depth = 0; depth < 5; depth++) {
    const res = await fetch(url, {
      headers: {
        'User-Agent': USER_AGENT,
        accept: 'text/html,application/xhtml+xml,application/xml',
        cookie: cookieHeader(),
      },
      redirect: 'manual',
    });
    extractCookies(res.headers);
    const location = res.headers.get('location');
    if (location === null) return;
    url = new URL(location, url).toString();
  }
}

async function getCrumb(): Promise<string> {
  if (crumb !== undefined) return crumb;
  for (let attempt = 0; attempt < 6; attempt++) {
    if (attempt > 0) await sleep(1500 * attempt);
    const res = await fetch(CRUMB_URL, {
      headers: {
        'User-Agent': USER_AGENT,
        origin: 'https://finance.yahoo.com',
        referer: 'https://finance.yahoo.com/quote/AAPL',
        accept: '*/*',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-US,en;q=0.9',
        'content-type': 'text/plain',
        cookie: cookieHeader(),
      },
    });
    if (res.status === 429) continue;
    if (!res.ok) throw new Error(`getcrumb responded ${res.status}`);
    const value = (await res.text()).trim();
    if (!value) throw new Error('getcrumb returned empty body');
    return (crumb = value);
  }
  throw new Error('getcrumb rate limited');
}

export const getCurrentStockPrices = async (
  stocks: { symbol: string; name: number }[],
) => {
  try {
    await acquireCookies();
    const crumbValue = await getCrumb();
    const symbols = stocks.map(({ symbol }) => symbol).join(',');
    const url = `${QUOTE_URL}?symbols=${encodeURIComponent(symbols)}&crumb=${encodeURIComponent(crumbValue)}`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': USER_AGENT,
        accept: '*/*',
        cookie: cookieHeader(),
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
    const priceBySymbol = new Map(
      (quoteResponse?.result ?? []).map(
        ({ symbol, regularMarketPrice }) => [symbol, regularMarketPrice],
      ),
    );
    const prices = stocks.map(({ symbol, name }) => ({
      price: priceBySymbol.get(symbol),
      name,
    }));
    const { output, success, issues } = safeParse(PricesSchema, prices);

    if (!success) {
      console.log(issues);
      return error(500, { message: 'external service error' });
    } else {
      return output;
    }
  } catch (err) {
    console.log(err);
    return error(500, { message: 'external service error' });
  }
};
