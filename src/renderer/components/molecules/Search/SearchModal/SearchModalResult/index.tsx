import { useState } from 'react';

import { css, useTheme } from '@emotion/react';

import {
  useHistories,
  useModifyHistories,
  useModifyWebview,
  useModifyTab,
  useFetchSolvedSearch,
} from '@/renderer/hooks';

import { TextButton } from '@/renderer/components/atoms/buttons/TextButton';

import { SearchList } from '@/renderer/components/molecules/Search/SearchList';
import { SearchItem } from '@/renderer/components/molecules/Search/SearchItem';

import BeatLoader from 'react-spinners/BeatLoader';

export function SearchModalResult() {
  const [more, setMore] = useState(false);

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
        <>
          {searchProblemResults.slice(0, more ? searchProblemResults.length : 7).map((problem) => {
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

          <div
            css={css`
              padding: 2px 8px 0 8px;
            `}
          >
            {(() => {
              if (searchProblemResults.length <= 7) {
                return null;
              }

              if (!more) {
                return <TextButton onClick={() => setMore(true)}>더보기</TextButton>;
              }

              return <TextButton onClick={() => setMore(false)}>접기</TextButton>;
            })()}
          </div>
        </>
      )}
    </SearchList>
  );
}
