import { DefaultError, useQuery } from '@tanstack/react-query';

export function useFetchSolvedSearch(query: string) {
  const {
    data: searchProblemResults,
    isError,
    isFetching,
  } = useQuery<
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

  return { searchProblemResults: isError ? [] : searchProblemResults || [], isFetching };
}
