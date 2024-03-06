import { createCollection } from '@/utils/createCollection';
import { Client } from '@hashgraph/sdk';
import { LONG_E2E_TIMEOUT, MIRROR_NODE_DELAY, operatorAccountId, operatorPrivateKey, secondPrivateKey } from '@/test/e2e/e2e-consts';
import { createAccount } from '@/utils/createAccount';
import { tokenAssociateToAccount } from '@/utils/tokenAssociateToAccount';
import { getAcceptedAccounts } from '@/utils/getAcceptedAccounts';

describe('getAcceptedAccounts', () => {
  let client: Client;
  let tokenId: string;
  let accountIdWithTokenAssociations: string;
  let accountIdWithBalance: string;
  let accountIdWithoutAssociationsOrBalance: string;

  beforeAll(async () => {
    client = Client.forName('testnet').setOperator(operatorAccountId, operatorPrivateKey);
    tokenId = await createCollection({
      client: client,
      treasuryAccount: client.getOperator()!.accountId,
      autoRenewAccountPrivateKey: secondPrivateKey,
      collectionName: 'test_name',
      collectionSymbol: 'test_symbol',
    });
    accountIdWithTokenAssociations = await createAccount({ client: client, tokenAssociations: 5 });
    accountIdWithBalance = await createAccount({ client: client, tokenAssociations: 0 });
    accountIdWithoutAssociationsOrBalance = await createAccount({ client: client, tokenAssociations: 0 });

    await new Promise((resolve) => setTimeout(resolve, MIRROR_NODE_DELAY));

    await tokenAssociateToAccount({
      client: client,
      tokenIds: [tokenId],
      accountId: accountIdWithTokenAssociations,
    });

    await tokenAssociateToAccount({
      client: client,
      tokenIds: [tokenId],
      accountId: accountIdWithBalance,
    });

    await new Promise((resolve) => setTimeout(resolve, MIRROR_NODE_DELAY));
  }, LONG_E2E_TIMEOUT);

  afterAll(async () => {
    client.close();
  });

  it(
    'should return accepted account',
    async () => {
      const result = await getAcceptedAccounts([accountIdWithTokenAssociations], tokenId, 'testnet');
      expect(result).toStrictEqual([accountIdWithTokenAssociations]);
    },
    LONG_E2E_TIMEOUT
  );

  it(
    'should return only account with association status grater than 0',
    async () => {
      const result = await getAcceptedAccounts([accountIdWithTokenAssociations, accountIdWithoutAssociationsOrBalance], tokenId, 'testnet');
      expect(result).toStrictEqual([accountIdWithTokenAssociations]);
    },
    LONG_E2E_TIMEOUT
  );

  it(
    'should return account with balance',
    async () => {
      const result = await getAcceptedAccounts([accountIdWithBalance], tokenId, 'testnet');
      expect(result).toStrictEqual([accountIdWithBalance]);
    },
    LONG_E2E_TIMEOUT
  );

  it(
    'should not return account without associations or balance',
    async () => {
      const result = await getAcceptedAccounts([accountIdWithoutAssociationsOrBalance], tokenId, 'testnet');
      expect(result).toStrictEqual([]);
    },
    LONG_E2E_TIMEOUT
  );
});
