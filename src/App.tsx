import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { nodeUrl } from '@/utils/const';
import { BalanceResponseType } from '@/types/balances-types';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import dictionary from '@/dictionary/en.json';
import { HoldersForm } from '@/components/HoldersForm';
import { AccountResponseType } from '@/types/account-types';
import { TokensResponseType } from '@/types/tokens-types';

const App = () => {
  const [tokenId, setTokenId] = useState<string>('');
  const [accountIds, setAccountIds] = useState<string>('');
  const [shouldFetch, setShouldFetch] = useState(false);

  const getAccountBalance = async (accountId: string) => {
    let accountBalance = 0;
    try {
      const balancesResponse = await fetch(`${nodeUrl}/api/v1/tokens/${tokenId}/balances?account.id=${accountId}`);
      const balancesData: BalanceResponseType = await balancesResponse.json();
      accountBalance = balancesData.balances[0].balance;
    } catch (error) {

    }
    return accountBalance;
  }

  const getMaxAutomaticTokenAssociations = async (accountId: string) => {
    let maxAutomaticTokenAssociations = 0;
    try {
      const accountResponse = await fetch(`${nodeUrl}/api/v1/accounts/${accountId}`);
      const accountData: AccountResponseType = await accountResponse.json();
      maxAutomaticTokenAssociations = accountData.max_automatic_token_associations;
    } catch (error) {

    }
    return maxAutomaticTokenAssociations;
  }

  const getPositiveAutomaticAssociationNumber = async (accountId: string) => {
    let nextLink: string = `${nodeUrl}/api/v1/accounts/${accountId}/tokens?limit=100`;
    let positiveAutomaticAssociation = 0;

    do {
      try {
        const response = await fetch(nextLink);
        const balancesData: TokensResponseType = await response.json();
        for (let token of balancesData.tokens) {
          if (token.automatic_association) positiveAutomaticAssociation ++;
        }

        nextLink = balancesData.links.next ? `${nodeUrl}${balancesData.links.next}` : '';
      } catch (error) {
        // throw new Error(error);
      }
    } while (nextLink);
    return positiveAutomaticAssociation;
  }

  const handleFetchBalances = async () => {
    const acceptedAccounts = [];
    for (const accountId of accountIds) {
      const accountBalance = await getAccountBalance(accountId);
      const maxAutomaticTokenAssociations = await getMaxAutomaticTokenAssociations(accountId);
      const positiveAutomaticAssociationNumber = await getPositiveAutomaticAssociationNumber(accountId);

      if (accountBalance || maxAutomaticTokenAssociations > positiveAutomaticAssociationNumber) {
        acceptedAccounts.push(accountId);
      }
    }
    return acceptedAccounts;
  };

  const { data = [], error, isFetching, isFetched, isSuccess } = useQuery({
    enabled: shouldFetch,
    retry: 0,
    throwOnError: false,
    queryKey: ['balances'],
    queryFn: () => handleFetchBalances(),
  });

  const copyToClipboard = async (textToCopy: string) => {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(textToCopy);
      toast.success(dictionary.copiedToClipboard);
      return;
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = textToCopy;

      textArea.style.position = 'absolute';
      textArea.style.left = '-999999px';

      document.body.prepend(textArea);
      textArea.select();

      try {
        document.execCommand('copy');
      } catch (error) {
        console.error(error);
      } finally {
        textArea.remove();
      }
    }
  };

  useEffect(() => {
    if (isSuccess) toast.success(dictionary.successfullyFetchedData);
  }, [isSuccess]);

  useEffect(() => {
    if (error) {
      toast.error(error.toString());
    }
  }, [error]);

  useEffect(() => {
    if (!isFetching && isFetched) setShouldFetch(false);
  }, [isFetched, isFetching]);

  return (
    <div className="container mx-auto">
      <h1 className="mt-20 scroll-m-20 text-center text-4xl font-extrabold tracking-tight lg:text-5xl">{dictionary.title}</h1>
      <p className="text-center leading-7 [&:not(:first-child)]:mt-6">{dictionary.description}</p>

      <div className="mb-20 mt-5">
        <HoldersForm setTokenId={setTokenId} setAccountIds={setAccountIds} setShouldFetch={setShouldFetch} isFetching={isFetching} />
      </div>

      {isFetched || isFetching ? (
        isFetching ? (
          <div className="flex w-full flex-col space-y-3">
            <Skeleton className="h-5 w-[120px]" />
            <Skeleton className="h-[200px] w-full rounded-xl" />
            <Skeleton className="!mt-5 h-10 w-full" />
          </div>
        ) : (
          <>
            <div className="grid w-full gap-5">
              <Label htmlFor="holders">
                {dictionary.found} {data.length || 0} {dictionary.accounts}
              </Label>
              <Textarea readOnly className="min-h-[200px]" id="holders" value={JSON.stringify(data)} />
              <Button
                onClick={async () => {
                  await copyToClipboard(JSON.stringify(data));
                }}
              >
                {dictionary.copyToClipboard}
              </Button>
            </div>
          </>
        )
      ) : null}
    </div>
  );
};

export default App;
