import { useCompletion } from 'ai/react';

import { FETCH_DOMAIN } from '@/common/constants';

export function useStreamingAICode(options?: { onError?: () => void }) {
  const { complete, completion, isLoading } = useCompletion({
    api: `${FETCH_DOMAIN}/api/ai/template`,
    experimental_throttle: 50,
    onError: options?.onError,
  });

  return { complete, completion, isLoading };
}
