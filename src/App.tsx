/*-
 *
 * Hedera Airdrop List Builder
 *
 * Copyright (C) 2024 Hedera Hashgraph, LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import dictionary from '@/dictionary/en.json';
import { HoldersForm } from '@/components/HoldersForm';
import { getAcceptedAccounts } from '@/utils/getAcceptedAccounts';

const App = () => {
  const [tokenId, setTokenId] = useState<string>('');
  const [accountIds, setAccountIds] = useState<string[]>([]);
  const [shouldFetch, setShouldFetch] = useState(false);

  const {
    data = [],
    error,
    isFetching,
    isFetched,
    isSuccess,
  } = useQuery({
    enabled: shouldFetch,
    retry: 0,
    throwOnError: false,
    queryKey: ['balances'],
    queryFn: () => getAcceptedAccounts(accountIds, tokenId),
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
    if (!isFetching && isSuccess) toast.success(dictionary.successfullyFetchedData);
  }, [isSuccess, isFetching]);

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
              <Textarea data-testid="response" readOnly className="min-h-[200px]" id="holders" value={JSON.stringify(data)} />
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
