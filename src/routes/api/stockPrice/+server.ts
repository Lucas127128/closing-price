import { error, type RequestHandler } from '@sveltejs/kit';
import { safeParse } from 'valibot';
import { getCurrentStockPrices } from '$lib/server/stock';
import { Temporal } from 'temporal-polyfill-lite';
import { SymbolsSchema } from '$lib/schema';
import { writeCsv } from 'hucre/csv';

export const POST: RequestHandler = async ({ request, platform }) => {
  const {
    output: symbols,
    success,
    issues,
  } = safeParse(SymbolsSchema, await request.json());
  if (!success) {
    console.log(issues);
    return error(422, {
      message: `Invalid symbol: ${issues[0].message}`,
    });
  }

  const prices = await getCurrentStockPrices(
    symbols.map((symbol) => ({ symbol: symbol.quote, name: symbol.name })),
  );
  const timeZone =
    platform?.cf?.timezone ??
    Intl.DateTimeFormat().resolvedOptions().timeZone;
  const date = Temporal.Now.zonedDateTimeISO().withTimeZone(timeZone);
  const time = date.toLocaleString('en-US', {
    hour12: false,
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  });

  const data = prices.map((price, index) => {
    if (index === 0) {
      return [price.name, price.price, time];
    } else {
      return [price.name, price.price];
    }
  });
  data.unshift(['symbol', 'price', 'time']);
  const csv = writeCsv(data);

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv',
    },
  });
};
