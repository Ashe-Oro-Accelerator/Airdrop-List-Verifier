import React from 'react';
import dictionary from '@/dictionary/en.json';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { formSchema } from '@/utils/formSchema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Textarea } from '@/components/ui/textarea';

type HoldersFormProps = {
  setTokenId: (tokenId: string) => void;
  setAccountIds: (setAccountIds: string) => void;
  setShouldFetch: (shouldFetch: boolean) => void;
  isFetching: boolean;
};

export const HoldersForm = ({ setTokenId, setAccountIds, setShouldFetch, isFetching }: HoldersFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tokenId: '',
      accountIds: '',
    },
  });

  const onSubmit = ({ tokenId, accountIds }: z.infer<typeof formSchema>) => {
    setTokenId(tokenId);
    setAccountIds(JSON.parse(accountIds));
    setShouldFetch(true);
  };

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
                    <Input placeholder={dictionary.exampleTokenId} {...field} />
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
                    <Textarea placeholder={dictionary.exampleAccountIds} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="flex items-center justify-center">
          <div className="w-full sm:w-[68%]">
            <Button className="w-full" disabled={isFetching} type="submit">
              {isFetching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <>{dictionary.buildList}</>}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};
