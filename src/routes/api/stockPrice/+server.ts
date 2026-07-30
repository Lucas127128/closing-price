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
import ExcelJS from 'exceljs';
import { format } from 'date-fns';
import { TZDate } from '@date-fns/tz';

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
  const date = new TZDate().withTimeZone(timeZone);
  const time = format(date, 'yyyy-MM-dd HH:mm:ss');

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Closing price');
  sheet.columns = [
    { header: 'symbol', key: 'symbol' },
    { header: 'price', key: 'price' },
    { header: 'time', key: 'time', width: 20 },
  ];
  sheet.addRow({ time });
  sheet.addRows(
    prices.map((price) => ({
      symbol: price.name,
      price: price.price,
    })),
  );

  return new Response(new Uint8Array(await workbook.xlsx.writeBuffer()), {
    headers: {
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="closingPrice.xlsx"',
    },
  });
};
