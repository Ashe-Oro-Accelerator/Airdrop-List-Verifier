import 'dotenv/config';

export const operatorAccountId = process.env.FIRST_ACCOUNT_ID!;
export const operatorPrivateKey = process.env.FIRST_PRIVATE_KEY!;
export const operatorPublicKey = process.env.FIRST_PUBLIC_KEY!;
export const secondPrivateKey = process.env.SECOND_PRIVATE_KEY!;
export const MIRROR_NODE_DELAY = 5000;
export const LONG_E2E_TIMEOUT = 45000;
