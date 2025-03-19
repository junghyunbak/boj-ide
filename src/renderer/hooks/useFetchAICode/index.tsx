import { useCompletion, type UseCompletionOptions } from '@ai-sdk/react';

import { FETCH_DOMAIN } from '@/common/constants';

export function useFetchAICode(options: UseCompletionOptions) {
  const { complete, completion, isLoading } = useCompletion({
    api: `${FETCH_DOMAIN}/api/ai/template`,
    experimental_throttle: 50,
    ...options,
  });

  return { complete, completion, isLoading };
}
