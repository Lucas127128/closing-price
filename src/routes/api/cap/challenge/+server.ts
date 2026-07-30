import { json } from '@sveltejs/kit';
import { generateChallenge, generateRswKeypair } from 'capjs-core';
import '../../../../../.svelte-kit/env.d.ts';
import { CAP_JS_SECRET } from '$app/env/private';

const KEYPAIR = generateRswKeypair(2048);

export async function POST() {
  const challenge = await generateChallenge(CAP_JS_SECRET, {
    format: 2,
    protocols: ['instrumentation', 'rsw'],
    keypair: KEYPAIR,
    t: 75000,
    instrumentation: {
      blockAutomatedBrowsers: true,
    },
  });
  return json(challenge);
}
