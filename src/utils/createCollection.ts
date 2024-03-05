import { AccountId, Client, PrivateKey, TokenCreateTransaction } from '@hashgraph/sdk';

export const createCollection = async ({
  client,
  collectionName,
  collectionSymbol,
  treasuryAccount,
  autoRenewAccountPrivateKey,
}: {
  client: Client;
  collectionName: string;
  collectionSymbol: string;
  treasuryAccount: AccountId;
  autoRenewAccountPrivateKey: string;
}): Promise<string> => {
  const transaction = new TokenCreateTransaction()
    .setTokenName(collectionName)
    .setTokenSymbol(collectionSymbol)
    .setTreasuryAccountId(treasuryAccount)
    .freezeWith(client);

  const signTx = await transaction.sign(PrivateKey.fromStringECDSA(autoRenewAccountPrivateKey));

  const txResponse = await signTx.execute(client);

  const receipt = await txResponse.getReceipt(client);

  return receipt?.tokenId?.toString() || '';
};
