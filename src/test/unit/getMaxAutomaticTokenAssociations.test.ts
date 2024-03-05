import { getMaxAutomaticTokenAssociations } from '@/utils/getMaxAutomaticTokenAssociations';
import fetchMock from 'jest-fetch-mock';
import { getMaxAutomaticTokenAssociationsResponse } from '@/test/__mocks__/getMaxAutomaticTokenAssociations-response';

fetchMock.enableMocks();

describe('getMaxAutomaticTokenAssociations', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('should return max automatic token associations', async () => {
    const mockAccountId = 'account1';

    fetchMock.mockResponseOnce(JSON.stringify(getMaxAutomaticTokenAssociationsResponse));

    const result = await getMaxAutomaticTokenAssociations(mockAccountId, 'testnet');

    expect(fetchMock.mock.calls.length).toEqual(1);
    expect(fetchMock.mock.calls[0][0]).toContain(mockAccountId);
    expect(result).toEqual(getMaxAutomaticTokenAssociationsResponse.max_automatic_token_associations);
  });
});
