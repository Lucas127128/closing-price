import { error, type RequestHandler } from '@sveltejs/kit';
import {
  array,
  minLength,
  number,
  object,
  pipe,
  safeParse,
  string,
} from 'valibot';
import { getCurrentStockPrices } from '$lib/server/stock';
import writeExcelFile from 'write-excel-file/universal';
import { format } from 'date-fns';
import { TZDateMini } from '@date-fns/tz';

const SymbolSchema = array(
  object({
    quote: pipe(string(), minLength(7)),
    name: number(),
  }),
);

export const POST: RequestHandler = async ({ request, platform }) => {
  const body = await request.json();
  const {
    output: symbols,
    success,
    issues,
  } = safeParse(SymbolSchema, body);
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
  const date = new TZDateMini().withTimeZone(timeZone);
  const time = format(date, 'yyyy-MM-dd HH:mm:ss');

  const data = prices.map((price, index) => {
    if (index === 0) {
      return [price.name, price.price, time];
    } else {
      return [price.name, price.price];
    }
  });
  data.unshift(['symbol', 'price', 'time']);
  const blob = await writeExcelFile([
    {
      data,
    },
  ]).toBlob();

  return new Response(blob, {
    headers: {
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="closingPrice.xlsx"',
    },
  });
};
