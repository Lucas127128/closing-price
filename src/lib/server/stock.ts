import stockApi from 'yahoo-finance2';
import { ArkErrors, type } from 'arktype';
import { error } from '@sveltejs/kit';

const client = new stockApi();
const PriceSchema = type('number');

export const getCurrentStockPrice = async (
  symbol: string,
  name: number,
) => {
  const { regularMarketPrice } = await client.quoteCombine(symbol);
  const output = PriceSchema(regularMarketPrice);
  if (output instanceof ArkErrors) {
    return error(500, { message: 'external service error' });
  } else {
    return { price: output, name };
  }
};
