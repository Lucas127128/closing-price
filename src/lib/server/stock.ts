import stockApi from 'yahoo-finance2';
import { number, safeParse, array, object } from 'valibot';
import { error } from '@sveltejs/kit';

const client = new stockApi({ quoteCombine: { debounceTime: 10 } });
const PricesSchema = array(object({ price: number(), name: number() }));

export const getCurrentStockPrices = async (
  stocks: { symbol: string; name: number }[],
) => {
  const prices = await Promise.all(
    stocks.map(async ({ symbol, name }) => {
      const { regularMarketPrice } = await client.quoteCombine(symbol);
      return { price: regularMarketPrice, name };
    }),
  );
  const { output, success, issues } = safeParse(PricesSchema, prices);

  if (!success) {
    console.log(issues);
    return error(500, { message: 'external service error' });
  } else {
    return output;
  }
};
