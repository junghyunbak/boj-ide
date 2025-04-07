import { DefaultError, useQuery } from '@tanstack/react-query';

export function useFetchSolvedSearch(query: string): {
  searchProblemResults: SolvedAC.API.SearchResponse['items'];
} {
  const { data: searchProblemResults, isError } = useQuery<
    SolvedAC.API.SearchResponse['items'],
    DefaultError,
    SolvedAC.API.SearchResponse['items'],
    [string, string]
  >({
    queryKey: ['solved-search', query],
    queryFn: async ({ queryKey }): Promise<SolvedAC.API.SearchResponse['items']> => {
      const response = await window.electron.ipcRenderer.invoke('search-problem', {
        data: { query: queryKey[1] },
      });

      if (!response) {
        return [];
      }

      return response.data;
    },
    staleTime: Infinity,
  });

  if (isError) {
    return { searchProblemResults: [] };
  }

  return { searchProblemResults: searchProblemResults || [] };
}
