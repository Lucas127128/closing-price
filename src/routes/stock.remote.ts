import { getRequestEvent, query } from '$app/server';
import { SymbolsSchema } from '$lib/schema';
import { getCurrentStockPrices } from '$lib/server/stock';
import { Temporal } from 'temporal-polyfill-lite';
import { writeCsv } from 'hucre/csv';

export const getCsv = query(SymbolsSchema, async (symbols) => {
  const { platform } = getRequestEvent();
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
  return writeCsv(data);
});

export const getQuotes = query(() => [
  { quote: '0001.HK', name: 1 },
  { quote: '0002.HK', name: 2 },
  { quote: '0003.HK', name: 3 },
  { quote: '0004.HK', name: 4 },
  { quote: '0005.HK', name: 5 },
  { quote: '0006.HK', name: 6 },
  { quote: '0020.HK', name: 20 },
  { quote: '0027.HK', name: 27 },
  { quote: '0066.HK', name: 66 },
  { quote: '0144.HK', name: 144 },
  { quote: '0175.HK', name: 175 },
  { quote: '0241.HK', name: 241 },
  { quote: '0268.HK', name: 268 },
  { quote: '0285.HK', name: 285 },
  { quote: '0291.HK', name: 291 },
  { quote: '0293.HK', name: 293 },
  { quote: '0316.HK', name: 316 },
  { quote: '0358.HK', name: 358 },
  { quote: '0386.HK', name: 386 },
  { quote: '0388.HK', name: 388 },
  { quote: '0390.HK', name: 390 },
  { quote: '0688.HK', name: 688 },
  { quote: '0700.HK', name: 700 },
  { quote: '0728.HK', name: 728 },
  { quote: '0762.HK', name: 762 },
  { quote: '0788.HK', name: 788 },
  { quote: '0823.HK', name: 823 },
  { quote: '0836.HK', name: 836 },
  { quote: '0857.HK', name: 857 },
  { quote: '0868.HK', name: 868 },
  { quote: '0883.HK', name: 883 },
  { quote: '0902.HK', name: 902 },
  { quote: '0914.HK', name: 914 },
  { quote: '0939.HK', name: 939 },
  { quote: '0941.HK', name: 941 },
  { quote: '0966.HK', name: 966 },
  { quote: '0968.HK', name: 968 },
  { quote: '0981.HK', name: 981 },
  { quote: '0992.HK', name: 992 },
  { quote: '0998.HK', name: 998 },
  { quote: '1024.HK', name: 1024 },
  { quote: '1088.HK', name: 1088 },
  { quote: '1093.HK', name: 1093 },
  { quote: '1109.HK', name: 1109 },
  { quote: '1171.HK', name: 1171 },
  { quote: '1211.HK', name: 1211 },
  { quote: '1299.HK', name: 1299 },
  { quote: '1336.HK', name: 1336 },
  { quote: '1339.HK', name: 1339 },
  { quote: '1347.HK', name: 1347 },
  { quote: '1378.HK', name: 1378 },
  { quote: '1398.HK', name: 1398 },
  { quote: '1766.HK', name: 1766 },
  { quote: '1772.HK', name: 1772 },
  { quote: '1801.HK', name: 1801 },
  { quote: '1810.HK', name: 1810 },
  { quote: '1876.HK', name: 1876 },
  { quote: '1888.HK', name: 1888 },
  { quote: '1919.HK', name: 1919 },
  { quote: '1928.HK', name: 1928 },
  { quote: '2015.HK', name: 2015 },
  { quote: '2018.HK', name: 2018 },
  { quote: '2020.HK', name: 2020 },
  { quote: '2238.HK', name: 2238 },
  { quote: '2269.HK', name: 2269 },
  { quote: '2313.HK', name: 2313 },
  { quote: '2318.HK', name: 2318 },
  { quote: '2319.HK', name: 2319 },
  { quote: '2328.HK', name: 2328 },
  { quote: '2331.HK', name: 2331 },
  { quote: '2333.HK', name: 2333 },
  { quote: '2382.HK', name: 2382 },
  { quote: '2388.HK', name: 2388 },
  { quote: '2601.HK', name: 2601 },
  { quote: '2628.HK', name: 2628 },
  { quote: '2800.HK', name: 2800 },
  { quote: '2883.HK', name: 2883 },
  { quote: '2899.HK', name: 2899 },
  { quote: '3323.HK', name: 3323 },
  { quote: '3328.HK', name: 3328 },
  { quote: '3690.HK', name: 3690 },
  { quote: '3750.HK', name: 3750 },
  { quote: '3888.HK', name: 3888 },
  { quote: '3968.HK', name: 3968 },
  { quote: '3988.HK', name: 3988 },
  { quote: '3993.HK', name: 3993 },
  { quote: '6030.HK', name: 6030 },
  { quote: '6060.HK', name: 6060 },
  { quote: '6160.HK', name: 6160 },
  { quote: '6618.HK', name: 6618 },
  { quote: '6862.HK', name: 6862 },
  { quote: '9618.HK', name: 9618 },
  { quote: '9626.HK', name: 9626 },
  { quote: '9633.HK', name: 9633 },
  { quote: '9868.HK', name: 9868 },
  { quote: '9888.HK', name: 9888 },
  { quote: '9961.HK', name: 9961 },
  { quote: '9988.HK', name: 9988 },
  { quote: '9992.HK', name: 9992 },
  { quote: '9999.HK', name: 9999 },
]);
