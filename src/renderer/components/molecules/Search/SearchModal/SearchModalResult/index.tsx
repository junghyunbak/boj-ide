import {
  useHistories,
  useModifyHistories,
  useModifyWebview,
  useModifyTab,
  useFetchSolvedSearch,
} from '@/renderer/hooks';

import { SearchList } from '@/renderer/components/molecules/Search/SearchList';
import { SearchItem } from '@/renderer/components/molecules/Search/SearchItem';

export function SearchModalResult() {
  const { historyFilterValue } = useHistories();

  const { gotoProblem } = useModifyWebview();
  const { addProblemTab } = useModifyTab();
  const { closeHistoryModal } = useModifyHistories();

  const { searchProblemResults } = useFetchSolvedSearch(historyFilterValue);

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
