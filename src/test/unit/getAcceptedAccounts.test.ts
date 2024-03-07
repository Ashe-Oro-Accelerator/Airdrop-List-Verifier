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
import { getAcceptedAccounts } from '@/utils/getAcceptedAccounts';
import fetchMock from 'jest-fetch-mock';
import { getAccountBalanceResponse } from '@/test/__mocks__/getAccountBalance-response';
import { getMaxAutomaticTokenAssociationsResponse } from '@/test/__mocks__/getMaxAutomaticTokenAssociations-response';
import { getPositiveAutomaticAssociationNumberNoNextResponse } from '@/test/__mocks__/getPositiveAutomaticAssociationNumberNoNext-response';
import { getPositiveAutomaticAssociationNumberHasNextResponse } from '@/test/__mocks__/getPositiveAutomaticAssociationNumberHasNext-response';
import { AccountResponseType } from '@/types/account-types';
import { BalanceResponseType } from '@/types/balances-types';
import { TokensResponseType } from '@/types/tokens-types';
import { getAccountBalanceNoAssociatedResponse } from '@/test/__mocks__/getAccountBalance-noAssociated-response';

fetchMock.enableMocks();

const mockAccountIds = ['account1'];
const mockTokenId = 'tokenId';
const baseUrl = 'https://mainnet-public.mirrornode.hedera.com/api/v1';

const setupFetchMocks = (responses: Array<AccountResponseType | BalanceResponseType | TokensResponseType>) => {
  responses.forEach((response) => fetchMock.mockResponseOnce(JSON.stringify(response)));
};

const assertFetchCalls = (numberOfCalls: number) => {
  expect(fetchMock.mock.calls.length).toEqual(numberOfCalls);
};

describe('getAcceptedAccounts', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('should return accepted accounts', async () => {
    setupFetchMocks([
      getAccountBalanceResponse,
      getMaxAutomaticTokenAssociationsResponse,
      getPositiveAutomaticAssociationNumberNoNextResponse,
    ]);

    const result = await getAcceptedAccounts(mockAccountIds, mockTokenId);

    assertFetchCalls(1);
    expect(fetchMock.mock.calls[0][0]).toEqual(`${baseUrl}/tokens/${mockTokenId}/balances?account.id=account1`);
    expect(result).toEqual(['account1']);
  });

  it('should return accepted accounts when tokens have two pages and is associated', async () => {
    setupFetchMocks([
      getAccountBalanceResponse,
      getMaxAutomaticTokenAssociationsResponse,
      getPositiveAutomaticAssociationNumberHasNextResponse,
      getPositiveAutomaticAssociationNumberNoNextResponse,
    ]);

    const result = await getAcceptedAccounts(mockAccountIds, mockTokenId);

    assertFetchCalls(1);
    expect(fetchMock.mock.calls[0][0]).toEqual(`${baseUrl}/tokens/${mockTokenId}/balances?account.id=account1`);
    expect(result).toEqual(['account1']);
  });

  it('should return accepted accounts when tokens have two pages and is not associated', async () => {
    setupFetchMocks([
      getAccountBalanceNoAssociatedResponse,
      getMaxAutomaticTokenAssociationsResponse,
      getPositiveAutomaticAssociationNumberHasNextResponse,
      getPositiveAutomaticAssociationNumberNoNextResponse,
    ]);

    const result = await getAcceptedAccounts(mockAccountIds, mockTokenId);

    assertFetchCalls(4);
    expect(fetchMock.mock.calls[0][0]).toEqual(`${baseUrl}/tokens/${mockTokenId}/balances?account.id=account1`);
    expect(fetchMock.mock.calls[1][0]).toEqual(`${baseUrl}/accounts/account1`);
    expect(fetchMock.mock.calls[2][0]).toEqual(`${baseUrl}/accounts/account1/tokens?limit=100`);
    expect(fetchMock.mock.calls[3][0]).toEqual(`${baseUrl}/accounts/0.0.3158096/tokens?limit=100&token.id=gt:0.0.3283757`);

    expect(result).toEqual(['account1']);
  });

  it('should return empty array when maxAutomaticTokenAssociations is null', async () => {
    setupFetchMocks([
      getAccountBalanceNoAssociatedResponse,
      {
        ...getMaxAutomaticTokenAssociationsResponse,
        max_automatic_token_associations: null,
      },
    ]);

    const result = await getAcceptedAccounts(mockAccountIds, mockTokenId);

    expect(result).toEqual([]);
  });

  it('should stop recursion when usedAutomaticAssociationSlots is bigger than maxAutomaticTokenAssociations', async () => {
    setupFetchMocks([
      getAccountBalanceNoAssociatedResponse,
      getMaxAutomaticTokenAssociationsResponse, // maxAutomaticTokenAssociations = 5
      getPositiveAutomaticAssociationNumberHasNextResponse, // usedAutomaticAssociationSlots = 1
      getPositiveAutomaticAssociationNumberHasNextResponse, // usedAutomaticAssociationSlots = 2
      getPositiveAutomaticAssociationNumberHasNextResponse, // usedAutomaticAssociationSlots = 3
      getPositiveAutomaticAssociationNumberHasNextResponse, // usedAutomaticAssociationSlots = 4
      getPositiveAutomaticAssociationNumberHasNextResponse, // usedAutomaticAssociationSlots = 5
      getPositiveAutomaticAssociationNumberHasNextResponse, // no useless call
      getPositiveAutomaticAssociationNumberHasNextResponse, // no useless call
      getPositiveAutomaticAssociationNumberNoNextResponse, // no useless call
    ]);

    const result = await getAcceptedAccounts(mockAccountIds, mockTokenId);

    assertFetchCalls(7);
    expect(fetchMock.mock.calls[0][0]).toEqual(`${baseUrl}/tokens/${mockTokenId}/balances?account.id=account1`);
    expect(fetchMock.mock.calls[1][0]).toEqual(`${baseUrl}/accounts/account1`);
    expect(fetchMock.mock.calls[2][0]).toEqual(`${baseUrl}/accounts/account1/tokens?limit=100`);
    expect(fetchMock.mock.calls[3][0]).toEqual(`${baseUrl}/accounts/0.0.3158096/tokens?limit=100&token.id=gt:0.0.3283757`);
    expect(fetchMock.mock.calls[4][0]).toEqual(`${baseUrl}/accounts/0.0.3158096/tokens?limit=100&token.id=gt:0.0.3283757`);
    expect(fetchMock.mock.calls[5][0]).toEqual(`${baseUrl}/accounts/0.0.3158096/tokens?limit=100&token.id=gt:0.0.3283757`);
    expect(fetchMock.mock.calls[6][0]).toEqual(`${baseUrl}/accounts/0.0.3158096/tokens?limit=100&token.id=gt:0.0.3283757`);

    expect(result).toEqual([]);
  });
});
