import { useCallback, useMemo } from 'react';

import { css } from '@emotion/react';

import { useStore } from '@/renderer/store';

import {
  useEventClickOutOfModal,
  useEventHistories,
  useHistories,
  useModifyHistories,
  useSetupHistories,
} from '@/renderer/hooks';

import { HISTORY_MODAL_MAX_HEIGHT, HISTORY_MODAL_MIN_HEIGHT } from '@/renderer/constants';

import { SplitLayout } from '@/renderer/components/molecules/SplitLayout';

import { NonModal } from '@/renderer/components/atoms/modal/NonModal';
import { ThreeLineHorizontalResizer } from '@/renderer/components/atoms/lines/ThreeLineHorizontalResizer';

import { ProblemHistoriItem } from './ProblemHistoryItem';
import {
  ProblemHistoryButton,
  ProblemHistoryButtonIcon,
  ProblemHistoryButtonParagraph,
  ProblemHistoryLayout,
  ProblemHistoryModalInput,
  ProblemHistoryModalInputBox,
  ProblemHistoryModalLayout,
  ProblemHistoryModalList,
  ProblemHistoryModalListBox,
  ProblemHistoryModalPlaceholder,
} from './index.style';

export function ProblemHistory() {
  const {
    isHistoryModalOpen,
    histories,
    isHistoryEmpty,
    historyFilterValue,
    historyButtonRef,
    historyModalRef,
    historyModalInputRef,
  } = useHistories();
  const { closeHistoryModal, openHistoryModal, updateHistoryModalHeight, updateHistoryFilterValue } =
    useModifyHistories();

  useSetupHistories();

  useEventHistories();
  useEventClickOutOfModal(historyButtonRef, historyModalRef, closeHistoryModal);

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
    <ProblemHistoryLayout>
      <ProblemHistoryButton onClick={handleHistoryBarClick} ref={historyButtonRef}>
        <ProblemHistoryButtonIcon />
        <ProblemHistoryButtonParagraph>방문 기록</ProblemHistoryButtonParagraph>
      </ProblemHistoryButton>

      {/**
       * // TODO: 모달 내 input 크기 변경
       * // TODO: 모달 테두리 둥글게
       * // TODO: 모달 크기 조절 바 input 까지로 변경
       * // TODO: 요소 닫기 버튼 hover 스타일 보이도록 수정
       */}
      <NonModal isOpen={isHistoryModalOpen} inset="-6px auto auto auto" ref={historyModalRef}>
        <SplitLayout vertical>
          <SplitLayout.Left
            px={verticalResizerPxOption}
            initialRatio={useStore.getState().historyModalHeight}
            onRatioChange={updateHistoryModalHeight}
          >
            <ProblemHistoryModalLayout>
              <ProblemHistoryModalInputBox>
                <ProblemHistoryModalInput
                  ref={historyModalInputRef}
                  value={historyFilterValue}
                  onChange={handleHistoryFilterValueChange}
                  placeholder="1000번: A+B"
                />
              </ProblemHistoryModalInputBox>

              <ProblemHistoryModalListBox>
                {isHistoryEmpty ? (
                  <ProblemHistoryModalPlaceholder>문제 히스토리가 존재하지 않습니다.</ProblemHistoryModalPlaceholder>
                ) : (
                  <ProblemHistoryModalList>
                    {histories
                      .filter((history) => `${history.number}번: ${history.name}`.includes(historyFilterValue))
                      .map((history) => {
                        return <ProblemHistoriItem key={history.number} problem={history} />;
                      })}
                  </ProblemHistoryModalList>
                )}
              </ProblemHistoryModalListBox>
            </ProblemHistoryModalLayout>
          </SplitLayout.Left>

          <SplitLayout.Resizer>
            <ThreeLineHorizontalResizer />
          </SplitLayout.Resizer>
        </SplitLayout>
      </NonModal>
    </ProblemHistoryLayout>
  );
}
