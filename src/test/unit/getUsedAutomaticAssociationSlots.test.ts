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
import { getUsedAutomaticAssociationSlots } from '@/utils/getUsedAutomaticAssociationSlots';
import fetchMock from 'jest-fetch-mock';
import { getPositiveAutomaticAssociationNumberNoNextResponse } from '@/test/__mocks__/getPositiveAutomaticAssociationNumberNoNext-response';
import { getPositiveAutomaticAssociationNumberHasNextResponse } from '@/test/__mocks__/getPositiveAutomaticAssociationNumberHasNext-response';
import { AccountResponseType } from '@/types/account-types';
import { BalanceResponseType } from '@/types/balances-types';
import { TokensResponseType } from '@/types/tokens-types';

fetchMock.enableMocks();

const mockAccountId = 'account1';
const setupFetchMocks = (responses: Array<AccountResponseType | BalanceResponseType | TokensResponseType>) => {
  responses.forEach((response) => fetchMock.mockResponseOnce(JSON.stringify(response)));
};

const assertFetchCalls = (callNumber: number) => {
  expect(fetchMock.mock.calls.length).toEqual(callNumber);
  expect(fetchMock.mock.calls[0][0]).toContain(mockAccountId);
};

describe('getUsedAutomaticAssociationSlots', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('should return positive automatic association number', async () => {
    setupFetchMocks([getPositiveAutomaticAssociationNumberNoNextResponse]);

    const result = await getUsedAutomaticAssociationSlots(mockAccountId, 'testnet', 5);

    assertFetchCalls(1);
    expect(result).toEqual(0); // 0 tokens have automatic_association set to true
  });

  it('should return automatic association number with next page', async () => {
    setupFetchMocks([getPositiveAutomaticAssociationNumberHasNextResponse, getPositiveAutomaticAssociationNumberNoNextResponse]);

    const result = await getUsedAutomaticAssociationSlots(mockAccountId, 'testnet', 5);

    assertFetchCalls(2);
    expect(result).toEqual(1); // 1 token have automatic_association set to true
  });

  it('should return automatic association number with many next page', async () => {
    setupFetchMocks([
      getPositiveAutomaticAssociationNumberHasNextResponse,
      getPositiveAutomaticAssociationNumberHasNextResponse,
      getPositiveAutomaticAssociationNumberHasNextResponse,
      getPositiveAutomaticAssociationNumberHasNextResponse,
      getPositiveAutomaticAssociationNumberHasNextResponse,
      getPositiveAutomaticAssociationNumberNoNextResponse,
    ]);

    const result = await getUsedAutomaticAssociationSlots(mockAccountId, 'testnet', 10);

    assertFetchCalls(6);
    expect(result).toEqual(5); // 1 token have automatic_association set to true
  });
});
