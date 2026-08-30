import type { D1Database } from '@cloudflare/workers-types';
import '@sveltejs/adapter-cloudflare';
import type { RequestLogger } from 'evlog';

declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface PageState {}
    interface Platform {
      env: {
        CAP_JS_D1: D1Database;
      };
    }
  }
  interface Locals {
    log: RequestLogger;
  }
}

export {};
