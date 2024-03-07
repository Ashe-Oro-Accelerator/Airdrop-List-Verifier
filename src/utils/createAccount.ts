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
