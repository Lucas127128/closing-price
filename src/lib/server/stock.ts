import stockApi from 'yahoo-finance2';
import { number, safeParse } from 'valibot';
import { error } from '@sveltejs/kit';

const client = new stockApi();
const PriceSchema = number();

export const getCurrentStockPrice = async (
  symbol: string,
  name: number,
) => {
  const { regularMarketPrice } = await client.quoteCombine(symbol);
  const { output, success, issues } = safeParse(
    PriceSchema,
    regularMarketPrice,
  );
  if (!success) {
    console.log(issues);
    return error(500, { message: 'external service error' });
  } else {
    return { price: output, name };
  }
};
