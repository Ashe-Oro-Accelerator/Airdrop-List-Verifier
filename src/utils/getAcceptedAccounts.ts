import { isAccountAssociatedToToken } from '@/utils/isAccountAssociatedToToken';
import { getMaxAutomaticTokenAssociations } from '@/utils/getMaxAutomaticTokenAssociations';
import { getUsedAutomaticAssociationSlots } from '@/utils/getUsedAutomaticAssociationSlots';
import { defaultNetwork } from '@/utils/const';

export const getAcceptedAccounts = async (accountIds: string[], tokenId: string, network: string = defaultNetwork) => {
  const acceptedAccounts = [];
  for (const accountId of accountIds) {
    const isAssociated = await isAccountAssociatedToToken(accountId, tokenId, network);

    if (isAssociated) {
      acceptedAccounts.push(accountId);
      continue;
    }

    const maxAutomaticTokenAssociations = await getMaxAutomaticTokenAssociations(accountId, network);

    if (!maxAutomaticTokenAssociations) {
      continue;
    }

    const usedAutomaticAssociationSlots = await getUsedAutomaticAssociationSlots(accountId, network, maxAutomaticTokenAssociations);

    if (maxAutomaticTokenAssociations > usedAutomaticAssociationSlots) {
      acceptedAccounts.push(accountId);
    }
  }
  return acceptedAccounts;
};
