import { getAcceptedAccounts } from '@/utils/getAcceptedAccounts';
import fetchMock from 'jest-fetch-mock';
import { getAccountBalanceResponse } from '@/test/__mocks__/get-account-balance-response';
import { getMaxAutomaticTokenAssociationsResponse } from '@/test/__mocks__/getMaxAutomaticTokenAssociations-response';
import { getPositiveAutomaticAssociationNumberNoNextResponse } from '@/test/__mocks__/getPositiveAutomaticAssociationNumberNoNext-response';
import { getPositiveAutomaticAssociationNumberHasNextResponse } from '@/test/__mocks__/getPositiveAutomaticAssociationNumberHasNext-response';

fetchMock.enableMocks();

const mockAccountIds = ['account1'];
const mockTokenId = 'tokenId';
const baseUrl = 'https://mainnet-public.mirrornode.hedera.com/api/v1';

const setupFetchMocks = (responses: any[]) => {
  responses.forEach((response) => fetchMock.mockResponseOnce(JSON.stringify(response)));
};

const assertFetchCalls = (numberOfCalls: number) => {
  expect(fetchMock.mock.calls.length).toEqual(numberOfCalls);
  expect(fetchMock.mock.calls[0][0]).toEqual(`${baseUrl}/tokens/${mockTokenId}/balances?account.id=account1`);
  expect(fetchMock.mock.calls[1][0]).toEqual(`${baseUrl}/accounts/account1`);
  expect(fetchMock.mock.calls[2][0]).toEqual(`${baseUrl}/accounts/account1/tokens?limit=100`);
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

    assertFetchCalls(3);
    expect(result).toEqual(['account1']);
  });

  it('should return accepted accounts when tokens have two pages', async () => {
    setupFetchMocks([
      getAccountBalanceResponse,
      getMaxAutomaticTokenAssociationsResponse,
      getPositiveAutomaticAssociationNumberHasNextResponse,
      getPositiveAutomaticAssociationNumberNoNextResponse,
    ]);

    const result = await getAcceptedAccounts(mockAccountIds, mockTokenId);

    assertFetchCalls(4);
    expect(result).toEqual(['account1']);
  });
});
