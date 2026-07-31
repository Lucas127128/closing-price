import { json } from '@sveltejs/kit';
import { generateChallenge, generateRswKeypair } from 'capjs-core';
import '../../../../../.svelte-kit/env.d.ts';
import { CAP_JS_SECRET } from '$app/env/private';
import { comptime } from 'comptime';

export async function POST() {
  const challenge = await generateChallenge(CAP_JS_SECRET, {
    format: 2,
    protocols: ['instrumentation', 'rsw'],
    keypair: comptime(() => generateRswKeypair(2048)),
    t: 75000,
    instrumentation: {
      blockAutomatedBrowsers: true,
    },
  });
  return json(challenge);
}
