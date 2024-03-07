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
import fetchMock from 'jest-fetch-mock';
import { getAccountBalanceResponse } from '@/test/__mocks__/getAccountBalance-response';

fetchMock.enableMocks();

describe('isAccountAssociatedToToken', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('should return account balance', async () => {
    const mockAccountId = 'account1';
    const mockTokenId = 'tokenId';

    fetchMock.mockResponseOnce(JSON.stringify(getAccountBalanceResponse));

    const result = await isAccountAssociatedToToken(mockAccountId, mockTokenId, 'testnet');

    expect(fetchMock.mock.calls.length).toEqual(1);
    expect(fetchMock.mock.calls[0][0]).toContain(`${mockAccountId}`);
    expect(fetchMock.mock.calls[0][0]).toContain(`${mockTokenId}`);
    expect(result).toBeTruthy();
  });
});
