import { useCompletion } from '@ai-sdk/react';

import { FETCH_DOMAIN } from '@/common/constants';

export function useFetchAICode(options?: { onError?: () => void }) {
  const { complete, completion, isLoading } = useCompletion({
    api: `${FETCH_DOMAIN}/api/ai/template`,
    experimental_throttle: 50,
    onError: options?.onError,
  });

  return { complete, completion, isLoading };
}
