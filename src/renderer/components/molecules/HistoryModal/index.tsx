import { useCallback, useMemo } from 'react';

import { css } from '@emotion/react';

import { useStore } from '@/renderer/store';

import { ReactComponent as History } from '@/renderer/assets/svgs/history.svg';

import {
  useEventClickOutOfModal,
  useEventWindow,
  useHistories,
  useModifyHistories,
  useSetupHistories,
} from '@/renderer/hooks';

import { HISTORY_MODAL_MAX_HEIGHT, HISTORY_MODAL_MIN_HEIGHT } from '@/renderer/constants';

import { SplitLayout } from '@/renderer/components/molecules/SplitLayout';

import { NonModal } from '@/renderer/components/atoms/modal/NonModal';
import { ThreeLineHorizontalResizer } from '@/renderer/components/atoms/lines/ThreeLineHorizontalResizer';

import { HistoryItem } from './HistoryItem';

export function HistoryModal() {
  const { isHistoryModalOpen, histories, isHistoryEmpty, historyFilterValue } = useHistories();
  const { closeHistoryModal, openHistoryModal, updateHistoryModalHeight, updateHistoryFilterValue } =
    useModifyHistories();
  const { buttonRef, modalRef, inputRef } = useSetupHistories();

  useEventClickOutOfModal(buttonRef, modalRef, closeHistoryModal);

  useEventWindow(
    (e) => {
      if (isHistoryModalOpen) {
        switch (e.key) {
          case 'ArrowDown':
          case 'ArrowUp': {
            e.preventDefault();

            const historyItems = Array.from(document.querySelectorAll<HTMLDivElement>('.history-item'));

            if (historyItems.length === 0) {
              break;
            }

            const idx = historyItems.findIndex((item) => item === document.activeElement);

            const nextItem =
              idx === -1
                ? historyItems[e.key === 'ArrowUp' ? historyItems.length - 1 : 0]
                : historyItems[(idx + (e.key === 'ArrowUp' ? -1 : 1) + historyItems.length) % historyItems.length];

            nextItem.focus();

            break;
          }
          case 'Enter': {
            const item = document.activeElement;

            if (item instanceof HTMLElement) {
              item.click();
            }
            break;
          }
          case 'Escape': {
            closeHistoryModal();
            break;
          }
          default: {
            inputRef.current?.focus();

            break;
          }
        }
      }
    },
    [isHistoryModalOpen, closeHistoryModal, inputRef],
    'keydown',
  );

  const handleHistoryFilterValueChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>(
    (e) => {
      updateHistoryFilterValue(e.target.value);
    },
    [updateHistoryFilterValue],
  );

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

      {/**
       * // TODO: 모달 내 input 크기 변경
       * // TODO: 모달 테두리 둥글게
       * // TODO: 모달 크기 조절 바 input 까지로 변경
       * // TODO: 요소 닫기 버튼 hover 스타일 보이도록 수정
       * // TODO: 모달 누르면 바로 input에 포커스 잡히도록 수정
       */}
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
                  ref={inputRef}
                  css={(theme) => css`
                    width: 100%;
                    background-color: ${theme.colors.code};
                    border: 1px solid ${theme.colors.border};
                    border-radius: 4px;
                    padding: 3px 4px;
                    outline: none;
                    color: ${theme.colors.fg};
                  `}
                  value={historyFilterValue}
                  onChange={handleHistoryFilterValueChange}
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
                    .filter((history) => `${history.number}번: ${history.name}`.includes(historyFilterValue))
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
