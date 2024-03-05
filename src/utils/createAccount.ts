import { AccountCreateTransaction, Client, Hbar, PublicKey } from '@hashgraph/sdk';
import { operatorPublicKey } from '@/test/e2e/e2e-consts';

export const createAccount = async ({ client, tokenAssociations }: { client: Client; tokenAssociations: number }): Promise<string> => {
  const transaction = new AccountCreateTransaction()
    .setKey(PublicKey.fromString(operatorPublicKey))
    .setInitialBalance(new Hbar(10))
    .setMaxAutomaticTokenAssociations(tokenAssociations);

  const txResponse = await transaction.execute(client);

  const receipt = await txResponse.getReceipt(client);

  const newAccountId = receipt.accountId;

  return newAccountId?.toString() || '';
};
