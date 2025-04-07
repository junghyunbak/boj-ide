import { useRef, useState, useEffect } from 'react';

import { useHistories, useModifyHistories, useModifyWebview, useModifyTab } from '@/renderer/hooks';

import { SearchList } from '@/renderer/components/molecules/Search/SearchList';
import { SearchItem } from '@/renderer/components/molecules/Search/SearchItem';

export function SearchModalResult() {
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [searchProblemResults, setSearchProblemResults] = useState<SolvedAC.API.SearchResponse['items']>([]);

  const { historyFilterValue } = useHistories();

  const { gotoProblem } = useModifyWebview();
  const { addProblemTab } = useModifyTab();
  const { closeHistoryModal } = useModifyHistories();

  useEffect(() => {
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }

    searchTimerRef.current = setTimeout(async () => {
      if (historyFilterValue === '') {
        setSearchProblemResults([]);
        return;
      }

      const response = await window.electron.ipcRenderer.invoke('search-problem', {
        data: { query: historyFilterValue },
      });

      if (!response) {
        return;
      }

      const { data } = response;

      setSearchProblemResults(data);
    }, 400);
  }, [historyFilterValue]);

  const handleSearchResultItemClick = (problemInfo: ProblemInfo) => () => {
    gotoProblem(problemInfo);
    addProblemTab(problemInfo);
    closeHistoryModal();
  };

  if (searchProblemResults.length === 0) {
    return null;
  }

  return (
    <SearchList listType="검색 결과">
      {searchProblemResults.slice(0, 7).map((problem) => {
        const problemInfo: ProblemInfo = {
          number: problem.problemId.toString(),
          name: problem.titleKo,
          testCase: {
            inputs: [],
            outputs: [],
          },
        };

        return (
          <SearchItem
            key={problem.problemId}
            problemInfo={problemInfo}
            onItemClick={handleSearchResultItemClick(problemInfo)}
            disableClose
          />
        );
      })}
    </SearchList>
  );
}
