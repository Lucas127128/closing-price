import {
  array,
  object,
  pipe,
  string,
  minLength,
  number,
  message,
} from 'valibot';

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

export const LoginSchema = object({
  username: message(
    pipe(string(), minLength(1)),
    'Username must be at least 1 character',
  ),
  password: message(
    pipe(string(), minLength(1)),
    'Password must be at least 1 character',
  ),
  capToken: message(
    pipe(string(), minLength(1)),
    'You must not skip any steps in our website',
  ),
});
