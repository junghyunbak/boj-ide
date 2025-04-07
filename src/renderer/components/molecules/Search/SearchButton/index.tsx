import { css } from '@emotion/react';

import { ReactComponent as SearchIcon } from '@/renderer/assets/svgs/search.svg';
import { useHistories, useModifyHistories } from '@/renderer/hooks';

export function SearchButton() {
  const { isHistoryModalOpen, historyButtonRef } = useHistories();
  const { openHistoryModal, closeHistoryModal } = useModifyHistories();

  const handleSearchButtonClick = () => {
    if (isHistoryModalOpen) {
      closeHistoryModal();
    } else {
      openHistoryModal();
    }
  };

  return (
    <button
      type="button"
      css={(theme) => css`
        width: 30dvw;
        max-width: 500px;

        display: flex;
        justify-content: center;
        align-items: center;
        gap: 0.2rem;

        background-color: ${theme.colors.code};
        color: ${theme.colors.fg};

        border: 1px solid ${theme.colors.border};
        border-radius: 4px;
        outline: none;

        user-select: none;

        cursor: pointer;
      `}
      onClick={handleSearchButtonClick}
      ref={historyButtonRef}
    >
      <SearchIcon
        css={(theme) => css`
          width: 0.875rem;
          color: ${theme.colors.fg};
        `}
      />
      <p
        css={css`
          white-space: nowrap;
        `}
      >
        검색
      </p>
    </button>
  );
}
