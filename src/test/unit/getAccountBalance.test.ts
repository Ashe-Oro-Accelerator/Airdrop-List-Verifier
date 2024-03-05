import { getAccountBalance } from '@/utils/getAccountBalance';
import fetchMock from 'jest-fetch-mock';
import { getAccountBalanceResponse } from '@/test/__mocks__/get-account-balance-response';

fetchMock.enableMocks();

describe('getAccountBalance', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('should return account balance', async () => {
    const mockAccountId = 'account1';
    const mockTokenId = 'tokenId';

    fetchMock.mockResponseOnce(JSON.stringify(getAccountBalanceResponse));

    const result = await getAccountBalance(mockAccountId, mockTokenId, 'testnet');

    expect(fetchMock.mock.calls.length).toEqual(1);
    expect(fetchMock.mock.calls[0][0]).toContain(`${mockAccountId}`);
    expect(fetchMock.mock.calls[0][0]).toContain(`${mockTokenId}`);
    expect(result).toBeTruthy();
  });
});
