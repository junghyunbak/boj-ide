import { css } from '@emotion/react';

import { useHistories, useModifyHistories } from '@/renderer/hooks';

export function SearchModalInput() {
  const { historyModalInputRef, historyFilterValue } = useHistories();
  const { updateHistoryFilterValue } = useModifyHistories();

  const handleHistoryFilterValueChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    updateHistoryFilterValue(e.target.value);
  };

  return (
    <div
      css={css`
        display: flex;
        justify-content: center;
        align-items: center;

        width: 100%;

        padding: 4px 4px 0 4px;
      `}
    >
      <input
        ref={historyModalInputRef}
        value={historyFilterValue}
        onChange={handleHistoryFilterValueChange}
        placeholder="solved.ac 검색 / 최근 항목 필터"
        css={(theme) => css`
          width: 100%;

          padding: 3px 4px;

          background-color: ${theme.colors.code};
          color: ${theme.colors.fg};

          border: 1px solid ${theme.colors.border};
          border-radius: 4px;

          outline: none;
        `}
      />
    </div>
  );
}
