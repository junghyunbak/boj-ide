import { memo, useCallback } from 'react';

import { css } from '@emotion/react';

import { placeholderLogo } from '@/renderer/assets/base64Images';

import { XButton } from '@/renderer/components/atoms/buttons/XButton';

import { useFetchProblem, useModifyWebview, useModifyHistories } from '@/renderer/hooks';

interface HistoryItemProps {
  problem: ProblemInfo;
}

export const HistoryItem = memo(({ problem }: HistoryItemProps) => {
  const { tierBase64, title } = useFetchProblem(problem.number);

  const { gotoProblem } = useModifyWebview();
  const { closeHistoryModal, removeHistoryWithProblemNumber } = useModifyHistories();

  const handleItemClick = useCallback(() => {
    gotoProblem(problem);
    closeHistoryModal();
  }, [gotoProblem, problem, closeHistoryModal]);

  const handleDeleteButtonClick = useCallback<React.MouseEventHandler<HTMLButtonElement>>(
    (e) => {
      e.stopPropagation();

      removeHistoryWithProblemNumber(problem);
    },
    [removeHistoryWithProblemNumber, problem],
  );

  return (
    <div
      className="history-item"
      css={(theme) => css`
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 2px 8px;
        user-select: none;
        outline: none;

        &:focus,
        &:hover {
          background-color: ${theme.colors.active};
          border-radius: 4px;

          & * {
            opacity: 1;
          }
        }
        cursor: pointer;
      `}
      tabIndex={-1}
      onClick={handleItemClick}
    >
      <div
        css={css`
          display: flex;
          gap: 0.5rem;
          flex: 1;
          overflow: hidden;
        `}
      >
        <img
          css={css`
            width: 0.75rem;
          `}
          src={tierBase64 || placeholderLogo}
        />
        <p
          css={(theme) => css`
            width: 100%;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            color: ${theme.colors.fg};
          `}
        >
          {`${problem.number}번: ${title}`}
        </p>
      </div>

      <div
        css={css`
          opacity: 0;
        `}
      >
        <XButton onClick={handleDeleteButtonClick} />
      </div>
    </div>
  );
});
