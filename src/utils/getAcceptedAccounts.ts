import { getAccountBalance } from '@/utils/getAccountBalance';
import { getMaxAutomaticTokenAssociations } from '@/utils/getMaxAutomaticTokenAssociations';
import { getPositiveAutomaticAssociationNumber } from '@/utils/getPositiveAutomaticAssociationNumber';
import { defaultNetwork } from '@/utils/const';

export const getAcceptedAccounts = async (accountIds: string[], tokenId: string, network: string = defaultNetwork) => {
  const acceptedAccounts = [];
  for (const accountId of accountIds) {
    const accountBalance = await getAccountBalance(accountId, tokenId, network);
    const maxAutomaticTokenAssociations = await getMaxAutomaticTokenAssociations(accountId, network);
    const positiveAutomaticAssociationNumber = await getPositiveAutomaticAssociationNumber(accountId, network);

    if (accountBalance || maxAutomaticTokenAssociations > positiveAutomaticAssociationNumber) {
      acceptedAccounts.push(accountId);
    }
  }
  return acceptedAccounts;
};
