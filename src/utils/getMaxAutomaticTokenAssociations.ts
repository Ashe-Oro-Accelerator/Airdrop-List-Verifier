import { AccountResponseType } from '@/types/account-types';
import { getMirrorNodeUrlForNetwork } from '@/utils/getMirrorNodeURLForNetwork';

export const getMaxAutomaticTokenAssociations = async (accountId: string, network: string) => {
  const accountResponse = await fetch(`${getMirrorNodeUrlForNetwork(network)}/api/v1/accounts/${accountId}`);
  const accountData: AccountResponseType = await accountResponse.json();
  return accountData.max_automatic_token_associations;
};
