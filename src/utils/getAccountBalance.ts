import { BalanceResponseType } from '@/types/balances-types';
import { getMirrorNodeUrlForNetwork } from '@/utils/getMirrorNodeURLForNetwork';

export const getAccountBalance = async (accountId: string, tokenId: string, network: string) => {
  const balancesResponse = await fetch(`${getMirrorNodeUrlForNetwork(network)}/api/v1/tokens/${tokenId}/balances?account.id=${accountId}`);
  const balancesData: BalanceResponseType = await balancesResponse.json();
  return balancesData.balances.length > 0;
};
