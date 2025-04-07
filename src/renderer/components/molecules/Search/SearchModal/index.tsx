import { useMemo } from 'react';

import { css } from '@emotion/react';

import { HISTORY_MODAL_MAX_HEIGHT, HISTORY_MODAL_MIN_HEIGHT } from '@/renderer/constants';

import { NonModal } from '@/renderer/components/atoms/modal/NonModal';
import { ThreeLineHorizontalResizer } from '@/renderer/components/atoms/lines/ThreeLineHorizontalResizer';

import { SplitLayout } from '@/renderer/components/molecules/SplitLayout';
import { SearchModalHistory } from '@/renderer/components/molecules/Search/SearchModal/SearchModalHistory';
import { SearchModalInput } from '@/renderer/components/molecules/Search/SearchModal/SearchModalInput';
import { SearchModalResult } from '@/renderer/components/molecules/Search/SearchModal/SearchModalResult';

import {
  useEventHistories,
  useHistories,
  useSetupHistories,
  useEventClickOutOfModal,
  useModifyHistories,
  useLayout,
  useModifyLayout,
} from '@/renderer/hooks';
import { SearchModalEditing } from '@/renderer/components/molecules/Search/SearchModal/SearchModalEditing';

export function SearchModal() {
  // TODO: Histories 네이밍 Search로 변경
  const { historyModalHeight } = useLayout();
  const { isHistoryModalOpen, historyModalRef, historyButtonRef } = useHistories();

  const { updateHistoryModalHeight } = useModifyLayout();
  const { closeHistoryModal } = useModifyHistories();

  const verticalResizerPxOption = useMemo(() => ({ min: HISTORY_MODAL_MIN_HEIGHT, max: HISTORY_MODAL_MAX_HEIGHT }), []);

  useSetupHistories();

  useEventHistories();

  useEventClickOutOfModal(historyButtonRef, historyModalRef, closeHistoryModal);

  return (
    <NonModal isOpen={isHistoryModalOpen} inset="0 auto auto auto" ref={historyModalRef} border="round">
      <div
        css={css`
          width: 100%;
          min-width: 508px;
          max-width: 600px;
          height: 100%;

          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;

          user-select: none;

          -webkit-app-region: no-drag;
        `}
      >
        <SearchModalInput />

        <SplitLayout vertical>
          <SplitLayout.Left
            px={verticalResizerPxOption}
            initialRatio={historyModalHeight}
            onRatioChange={updateHistoryModalHeight}
          >
            <div
              css={css`
                width: 100%;
                height: 100%;

                padding: 0 4px;

                overflow-y: auto;
              `}
            >
              <SearchModalEditing />
              <SearchModalResult />
              <SearchModalHistory />
            </div>
          </SplitLayout.Left>

          <SplitLayout.Resizer>
            <ThreeLineHorizontalResizer />
          </SplitLayout.Resizer>
        </SplitLayout>
      </div>
    </NonModal>
  );
}
