import { useHistories, useModifyHistories, useModifyTab, useModifyWebview } from '@/renderer/hooks';

import { SearchList } from '@/renderer/components/molecules/Search/SearchList';
import { SearchItem } from '@/renderer/components/molecules/Search/SearchItem';

export function SearchModalHistory() {
  const { histories, historyFilterValue } = useHistories();

  const { gotoProblem } = useModifyWebview();
  const { addProblemTab } = useModifyTab();
  const { closeHistoryModal, removeHistoryWithProblemNumber } = useModifyHistories();

  const handleHistoryItemClick = (problem: ProblemInfo) => () => {
    gotoProblem(problem);
    addProblemTab(problem);
    closeHistoryModal();
  };

  const handleHistoryItemCloseButtonClick = (problem: ProblemInfo) => () => {
    removeHistoryWithProblemNumber(problem);
  };

  const filteredHistories = histories.filter((history) =>
    `${history.number}번: ${history.name}`.includes(historyFilterValue),
  );

  return (
    <SearchList listType="최근 항목">
      {filteredHistories.length === 0 ? (
        <p>문제 히스토리가 존재하지 않습니다.</p>
      ) : (
        filteredHistories.map((history) => {
          return (
            <SearchItem
              key={history.number}
              problemInfo={history}
              onItemClick={handleHistoryItemClick(history)}
              onCloseButtonClick={handleHistoryItemCloseButtonClick(history)}
            />
          );
        })
      )}
    </SearchList>
  );
}
