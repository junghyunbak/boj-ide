import { memo, useCallback, useMemo, useRef, useState } from 'react';

import { css } from '@emotion/react';

import { useStore } from '@/renderer/store';

import { ReactComponent as History } from '@/renderer/assets/svgs/history.svg';

import {
  useEventClickOutOfModal,
  useFetchProblem,
  useHistories,
  useModifyHistories,
  useModifyWebview,
} from '@/renderer/hooks';

import { placeholderLogo } from '@/renderer/assets/base64Images';

import { HISTORY_MODAL_MAX_HEIGHT, HISTORY_MODAL_MIN_HEIGHT } from '@/renderer/constants';

import { SplitLayout } from '@/renderer/components/molecules/SplitLayout';

import { NonModal } from '@/renderer/components/atoms/modal/NonModal';
import { XButton } from '@/renderer/components/atoms/buttons/XButton';
import { ThreeLineHorizontalResizer } from '@/renderer/components/atoms/lines/ThreeLineHorizontalResizer';

export function HistoryModal() {
  const { isHistoryModalOpen, histories, isHistoryEmpty } = useHistories();
  const { closeHistoryModal, openHistoryModal, updateHistoryModalHeight } = useModifyHistories();

  const buttonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const [filterValue, setFilterValue] = useState('');

  useEventClickOutOfModal(buttonRef, modalRef, closeHistoryModal);

  const handleHistoryBarClick = useCallback(() => {
    if (isHistoryModalOpen) {
      closeHistoryModal();
    } else {
      openHistoryModal();
    }
  }, [openHistoryModal, closeHistoryModal, isHistoryModalOpen]);

  const verticalResizerPxOption = useMemo(() => ({ min: HISTORY_MODAL_MIN_HEIGHT, max: HISTORY_MODAL_MAX_HEIGHT }), []);

  return (
    <div
      css={css`
        position: absolute;
        width: 30dvw;
        max-width: 500px;
        display: flex;
        justify-content: center;
      `}
    >
      <button
        type="button"
        onClick={handleHistoryBarClick}
        ref={buttonRef}
        css={(theme) => css`
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: ${theme.colors.code};
          border: 1px solid ${theme.colors.border};
          border-radius: 4px;
          padding: 2px 0;
          outline: none;
          color: ${theme.colors.fg};
          gap: 0.25rem;
          user-select: none;
          cursor: pointer;
        `}
      >
        <History
          css={(theme) => css`
            width: 0.75rem;
            color: ${theme.colors.fg};
          `}
        />
        <p>방문 기록</p>
      </button>

      <NonModal isOpen={isHistoryModalOpen} inset="-6px auto auto auto" ref={modalRef}>
        <SplitLayout vertical>
          <SplitLayout.Left
            px={verticalResizerPxOption}
            initialRatio={useStore.getState().historyModalHeight}
            onRatioChange={updateHistoryModalHeight}
          >
            <div
              css={css`
                width: 100%;
                min-width: 500px;
                height: 100%;
                user-select: none;
                display: flex;
                flex-direction: column;
                align-items: center;
              `}
            >
              <div
                css={css`
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  width: 100%;
                  padding: 4px;
                `}
              >
                <input
                  css={(theme) => css`
                    width: 100%;
                    background-color: ${theme.colors.code};
                    border: 1px solid ${theme.colors.border};
                    border-radius: 4px;
                    padding: 2px 4px;
                    outline: none;
                    color: ${theme.colors.fg};
                  `}
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                  placeholder="1000번: A+B"
                />
              </div>
              <div
                css={css`
                  width: 100%;
                  height: 100%;
                  overflow-y: auto;
                  padding: 0 4px;
                  display: flex;
                  flex-direction: column;
                `}
              >
                {isHistoryEmpty ? (
                  <p
                    css={css`
                      padding: 0.25rem;
                    `}
                  >
                    문제 히스토리가 존재하지 않습니다.
                  </p>
                ) : (
                  histories
                    .filter((history) => `${history.number}번: ${history.name}`.includes(filterValue))
                    .map((history) => {
                      return <HistoryItem key={history.number} problem={history} />;
                    })
                )}
              </div>
            </div>
          </SplitLayout.Left>

          <SplitLayout.Resizer>
            <ThreeLineHorizontalResizer />
          </SplitLayout.Resizer>
        </SplitLayout>
      </NonModal>
    </div>
  );
}

interface HistoryItemProps {
  problem: ProblemInfo;
}

const HistoryItem = memo(({ problem }: HistoryItemProps) => {
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
      css={(theme) => css`
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 2px 8px;
        user-select: none;
        &:hover {
          background-color: ${theme.colors.active};
          border-radius: 4px;

          & * {
            opacity: 1;
          }
        }
        cursor: pointer;
      `}
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
