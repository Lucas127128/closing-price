import { array, object, pipe, string, minLength, number } from 'valibot';

export const SymbolSchema = object({
  quote: pipe(string(), minLength(7)),
  name: number(),
});

export const SymbolsSchema = array(
  object({
    quote: pipe(string(), minLength(7)),
    name: number(),
  }),
);
