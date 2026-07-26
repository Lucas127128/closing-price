import { error, type RequestHandler } from '@sveltejs/kit';
import { ArkErrors, type } from 'arktype';
import { getCurrentStockPrice } from '$lib/server/stock';
import ExcelJS from 'exceljs';
import pThrottle from 'p-throttle';

const SymbolSchema = type({
  quote: 'string >= 7',
  name: 'number',
}).array();

export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json();
  const symbols = SymbolSchema(body);
  if (symbols instanceof ArkErrors) {
    console.log(symbols);
    return error(422, {
      message: `Invalid symbol: ${symbols[0].problem}`,
    });
  }

  const throttle = pThrottle({ limit: 1, interval: 150 });
  const throttledGetCurrentStockPrice = throttle(getCurrentStockPrice);
  const prices = await Promise.all(
    symbols.map(async (symbol) => {
      return throttledGetCurrentStockPrice(symbol.quote, symbol.name);
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
