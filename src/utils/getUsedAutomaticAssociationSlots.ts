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
import { TokensResponseType } from '@/types/tokens-types';
import { getMirrorNodeUrlForNetwork } from '@/utils/getMirrorNodeURLForNetwork';

export const getUsedAutomaticAssociationSlots = async (accountId: string, network: string, maxAutomaticTokenAssociations: number) => {
  let nextLink: string = `${getMirrorNodeUrlForNetwork(network)}/api/v1/accounts/${accountId}/tokens?limit=100`;
  let usedSlots = 0;

  do {
    if (usedSlots >= maxAutomaticTokenAssociations) break;
    const response = await fetch(nextLink);
    const balancesData: TokensResponseType = await response.json();
    for (const token of balancesData.tokens) {
      if (token.automatic_association) usedSlots++;
    }

    nextLink = balancesData.links.next ? `${getMirrorNodeUrlForNetwork(network)}${balancesData.links.next}` : '';
  } while (nextLink);

  return usedSlots;
};
