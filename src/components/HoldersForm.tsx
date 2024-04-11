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
import React, { useEffect, useState } from 'react';
import dictionary from '@/dictionary/en.json';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { formSchema } from '@/utils/formSchema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Textarea } from '@/components/ui/textarea';
import { parseCSV } from '@/utils/parseCSV';
import { Progress } from '@/components/ui/progress';
import { fetchTokenName } from '@/utils/fetchTokenName';
import { isValidTokenId } from '@/utils/isValidTokenId';

type HoldersFormProps = {
  setTokenId: (_tokenId: string) => void;
  setAccountIds: (_setAccountIds: string[]) => void;
  setShouldFetch: (_shouldFetch: boolean) => void;
  isFetching: boolean;
  fetchedAccountsBalance: number;
};

export const HoldersForm = ({ setTokenId, setAccountIds, setShouldFetch, isFetching, fetchedAccountsBalance }: HoldersFormProps) => {
  const [accountIdsLength, setAccountIdsLength] = useState(0);
  const [progress, setProgress] = useState(0);
  const [tokenName, setTokenName] = useState<string>('');
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tokenId: '',
      accountIds: '',
    },
  });

  const onSubmit = ({ tokenId, accountIds }: z.infer<typeof formSchema>) => {
    setTokenId(tokenId);
    setAccountIdsLength(parseCSV(accountIds).length);
    setAccountIds(parseCSV(accountIds));
    setShouldFetch(true);
  };

  const handleTokenBlur = async (tokenId: string) => {
    if (!isValidTokenId(tokenId)) return;
    const tokenName = await fetchTokenName(tokenId, 'mainnet');
    setTokenName(tokenName);
  };

  const calculatePercentage = (current: number, total: number) => (current / total) * 100;

  useEffect(() => {
    setProgress(calculatePercentage(fetchedAccountsBalance, accountIdsLength));
    if (!isFetching && fetchedAccountsBalance === accountIdsLength) setProgress(0);
  }, [accountIdsLength, fetchedAccountsBalance, isFetching]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="mt-10 flex items-start justify-center gap-2">
          <div className="w-full sm:w-1/3">
            <FormField
              control={form.control}
              name="tokenId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{dictionary.tokenId}</FormLabel>
                  <FormControl>
                    <>
                      <Input
                        data-testid="tokenId"
                        placeholder={dictionary.exampleTokenId}
                        {...field}
                        onBlur={(event) => {
                          field.onBlur();
                          void handleTokenBlur(event.target.value);
                        }}
                      />
                      {tokenName && <p className="text-sm text-muted-foreground">{tokenName}</p>}
                    </>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-full sm:w-1/3">
            <FormField
              control={form.control}
              name="accountIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{dictionary.accountIds}</FormLabel>
                  <FormControl>
                    <Textarea data-testid="accountIds" placeholder={dictionary.exampleAccountIds} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="flex items-center justify-center">
          <div className="w-full sm:w-[68%]">
            {isFetching ? (
              <Progress className="mt-6" value={progress} />
            ) : (
              <Button data-testid="submit" className="w-full" disabled={isFetching} type="submit">
                {dictionary.buildList}
              </Button>
            )}
          </div>
        </div>
      </form>
    </Form>
  );
};
