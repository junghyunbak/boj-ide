import { useQuery } from '@tanstack/react-query';

import { placeholderLogo } from '@/renderer/assets/base64Images';

export function useFetchProblem(problemNumber: string): { tierBase64: string | null; title: string } {
  const { data: solvedProblem, isError } = useQuery({
    queryKey: ['solved.ac', problemNumber],
    queryFn: async () => {
      const data = await window.electron.ipcRenderer.invoke('get-solved-tier', { data: { problemId: problemNumber } });

      if (!data) {
        return {
          level: 0,
          title: '',
          tierBase64: placeholderLogo,
        };
      }

      return data.data;
    },
  });

  if (isError || !solvedProblem) {
    return {
      tierBase64: null,
      title: '',
    };
  }

  const { title, tierBase64 } = solvedProblem;

  return {
    tierBase64,
    title,
  };
}
