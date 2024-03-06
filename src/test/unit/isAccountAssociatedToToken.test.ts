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
