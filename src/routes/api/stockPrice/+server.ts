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
import { getCurrentStockPrice } from '$lib/server/stock';
import ExcelJS from 'exceljs';

const SymbolSchema = array(
  object({
    quote: pipe(string(), minLength(7)),
    name: number(),
  }),
);

export const POST: RequestHandler = async ({ request }) => {
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

  const prices = await Promise.all(
    symbols.map(async (symbol) => {
      return getCurrentStockPrice(symbol.quote, symbol.name);
    }),
  );
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Closing price');
  sheet.columns = [
    { header: 'symbol', key: 'symbol', width: 15 },
    { header: 'price', key: 'price', width: 15 },
  ];
  sheet.addRows(
    prices.map((price) => ({ symbol: price.name, price: price.price })),
  );
  return new Response(new Uint8Array(await workbook.xlsx.writeBuffer()), {
    headers: {
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="closingPrice.xlsx"',
    },
  });
};
