import { TokensResponseType } from '@/types/tokens-types';
import { getMirrorNodeUrlForNetwork } from '@/utils/getMirrorNodeURLForNetwork';

export const getUsedAutomaticAssociationSlots = async (accountId: string, network: string) => {
  let nextLink: string = `${getMirrorNodeUrlForNetwork(network)}/api/v1/accounts/${accountId}/tokens?limit=100`;
  let usedSlots = 0;

  do {
    const response = await fetch(nextLink);
    const balancesData: TokensResponseType = await response.json();
    for (const token of balancesData.tokens) {
      if (token.automatic_association) usedSlots++;
    }

    nextLink = balancesData.links.next ? `${getMirrorNodeUrlForNetwork(network)}${balancesData.links.next}` : '';
  } while (nextLink);

  return usedSlots;
};
