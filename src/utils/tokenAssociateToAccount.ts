import { Client, PrivateKey, TokenAssociateTransaction } from '@hashgraph/sdk';
import { operatorPrivateKey } from '@/test/e2e/e2e-consts';

export const tokenAssociateToAccount = async ({
  client,
  accountId,
  tokenIds,
}: {
  client: Client;
  accountId: string;
  tokenIds: string[];
}): Promise<string> => {
  const transaction = new TokenAssociateTransaction().setAccountId(accountId).setTokenIds(tokenIds).freezeWith(client);

  const signTx = await transaction.sign(PrivateKey.fromStringECDSA(operatorPrivateKey));

  const txResponse = await signTx.execute(client);

  const receipt = await txResponse.getReceipt(client);

  const transactionStatus = receipt.status;

  return transactionStatus?.toString() || '';
};
