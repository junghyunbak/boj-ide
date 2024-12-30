import { useCompletion } from 'ai/react';
import { FETCH_DOMAIN } from '@/constants';

export function useStreamingAICode() {
  const { complete, completion, isLoading, error } = useCompletion({
    api: `${FETCH_DOMAIN}/api/ai/template`,
    experimental_throttle: 50,
  });

  return { complete, completion, isLoading, error };
}
