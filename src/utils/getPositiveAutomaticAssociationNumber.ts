import { TokensResponseType } from '@/types/tokens-types';
import { getMirrorNodeUrlForNetwork } from '@/utils/getMirrorNodeURLForNetwork';

export const getPositiveAutomaticAssociationNumber = async (accountId: string, network: string) => {
  let nextLink: string = `${getMirrorNodeUrlForNetwork(network)}/api/v1/accounts/${accountId}/tokens?limit=100`;
  let positiveAutomaticAssociation = 0;

  do {
    const response = await fetch(nextLink);
    const balancesData: TokensResponseType = await response.json();
    for (const token of balancesData.tokens) {
      if (token.automatic_association) positiveAutomaticAssociation++;
    }

    nextLink = balancesData.links.next ? `${getMirrorNodeUrlForNetwork(network)}${balancesData.links.next}` : '';
  } while (nextLink);

  return positiveAutomaticAssociation;
};
