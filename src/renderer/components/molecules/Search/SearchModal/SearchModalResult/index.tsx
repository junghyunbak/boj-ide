import { css, useTheme } from '@emotion/react';

import {
  useHistories,
  useModifyHistories,
  useModifyWebview,
  useModifyTab,
  useFetchSolvedSearch,
} from '@/renderer/hooks';

import { SearchList } from '@/renderer/components/molecules/Search/SearchList';
import { SearchItem } from '@/renderer/components/molecules/Search/SearchItem';

import BeatLoader from 'react-spinners/BeatLoader';

export function SearchModalResult() {
  const { historyFilterValue } = useHistories();

  const { gotoProblem } = useModifyWebview();
  const { addProblemTab } = useModifyTab();
  const { closeHistoryModal } = useModifyHistories();

  const emotionTheme = useTheme();

  const { searchProblemResults, isFetching } = useFetchSolvedSearch(historyFilterValue);

  const handleSearchResultItemClick = (problemInfo: ProblemInfo) => () => {
    gotoProblem(problemInfo);
    addProblemTab(problemInfo);
    closeHistoryModal();
  };

  return (
    <SearchList listType="검색 결과">
      {isFetching ? (
        <div
          css={css`
            width: 100%;
            display: flex;
            justify-content: center;
            padding: 0.5rem 0;
          `}
        >
          <BeatLoader color={emotionTheme.colors.primarybg} size={16} />
        </div>
      ) : searchProblemResults.length === 0 ? (
        <p>검색 결과가 존재하지 않습니다.</p>
      ) : (
        searchProblemResults.slice(0, 7).map((problem) => {
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
        })
      )}
    </SearchList>
  );
}
