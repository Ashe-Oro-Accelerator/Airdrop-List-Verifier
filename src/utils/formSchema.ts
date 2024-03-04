import { z } from 'zod';
import dictionary from '@/dictionary/en.json';

export const formSchema = z.object({
  tokenId: z.string().refine((value) => /^0\.0\.\d*$/.test(value), {
    message: dictionary.tokenIdFormatError,
  }),
  accountIds: z.string().refine(
    (value) => {
      try {
        const parsedValue = JSON.parse(value);
        return Array.isArray(parsedValue) && parsedValue.every(item => typeof item === 'string');
      } catch {
        return false;
      }
    },
    {
      message: dictionary.accountIdsFormatError,
    },
  ),
});
