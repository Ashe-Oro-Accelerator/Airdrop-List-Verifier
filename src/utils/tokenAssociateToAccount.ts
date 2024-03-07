/*-
 *
 * Hedera Airdrop List Builder
 *
 * Copyright (C) 2024 Hedera Hashgraph, LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
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
