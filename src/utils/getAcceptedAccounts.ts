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
import { isAccountAssociatedToToken } from '@/utils/isAccountAssociatedToToken';
import { getMaxAutomaticTokenAssociations } from '@/utils/getMaxAutomaticTokenAssociations';
import { getUsedAutomaticAssociationSlots } from '@/utils/getUsedAutomaticAssociationSlots';

export const getAcceptedAccounts = async (
  accountIds: string[],
  tokenId: string,
  network: string,
  setFetchedAccountsBalance?: (_value: number) => void
) => {
  const acceptedAccounts = [];
  for (const [index, accountId] of accountIds.entries()) {
    if (setFetchedAccountsBalance) {
      setFetchedAccountsBalance(index + 1);
    }
    const isAssociated = await isAccountAssociatedToToken(accountId, tokenId, network);

    if (isAssociated) {
      acceptedAccounts.push(accountId);
      continue;
    }

    const maxAutomaticTokenAssociations = await getMaxAutomaticTokenAssociations(accountId, network);

    if (!maxAutomaticTokenAssociations) {
      continue;
    }

    const usedAutomaticAssociationSlots = await getUsedAutomaticAssociationSlots(accountId, network, maxAutomaticTokenAssociations);

    if (maxAutomaticTokenAssociations > usedAutomaticAssociationSlots) {
      acceptedAccounts.push(accountId);
    }
  }
  return acceptedAccounts;
};
