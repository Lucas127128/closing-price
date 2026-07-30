import { json } from '@sveltejs/kit';
import { generateChallenge, generateRswKeypair } from 'capjs-core';

const KEYPAIR = generateRswKeypair(2048);

export async function POST() {
  const challenge = await generateChallenge(
    '1234567890123456789012345678901234567890',
    {
      format: 2,
      protocols: ['instrumentation', 'rsw'],
      keypair: KEYPAIR,
      t: 75000,
      instrumentation: {
        blockAutomatedBrowsers: true,
      },
    },
  );
  return json(challenge);
}
