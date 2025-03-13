import { useCallback, useMemo } from 'react';

import {
  useEventClickOutOfModal,
  useEventHistories,
  useHistories,
  useLayout,
  useModifyHistories,
  useModifyLayout,
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
  const { historyModalHeight } = useLayout();

  const { closeHistoryModal, openHistoryModal, updateHistoryFilterValue } = useModifyHistories();
  const { updateHistoryModalHeight } = useModifyLayout();

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

      <NonModal isOpen={isHistoryModalOpen} inset="-8px auto auto auto" ref={historyModalRef} border="round">
        <ProblemHistoryModalLayout>
          <ProblemHistoryModalInputBox>
            <ProblemHistoryModalInput
              ref={historyModalInputRef}
              value={historyFilterValue}
              onChange={handleHistoryFilterValueChange}
              placeholder="1000번: A+B"
            />
          </ProblemHistoryModalInputBox>

          <SplitLayout vertical>
            <SplitLayout.Left
              px={verticalResizerPxOption}
              initialRatio={historyModalHeight}
              onRatioChange={updateHistoryModalHeight}
            >
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
            </SplitLayout.Left>

            <SplitLayout.Resizer>
              <ThreeLineHorizontalResizer />
            </SplitLayout.Resizer>
          </SplitLayout>
        </ProblemHistoryModalLayout>
      </NonModal>
    </ProblemHistoryLayout>
  );
}
