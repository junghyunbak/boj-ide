import { useMemo } from 'react';

import { css } from '@emotion/react';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { ReactComponent as Python } from '@/renderer/assets/svgs/python.svg';
import { ReactComponent as JavaScript } from '@/renderer/assets/svgs/js-typo.svg';
import { ReactComponent as Java } from '@/renderer/assets/svgs/java-typo.svg';
import { ReactComponent as Cpp } from '@/renderer/assets/svgs/cpp-typo.svg';

import {
  useEventClickOutOfModal,
  useEventHistories,
  useFetchProblem,
  useHistories,
  useLayout,
  useModifyHistories,
  useModifyLanguage,
  useModifyLayout,
  useModifyTab,
  useModifyWebview,
  useSetupHistories,
} from '@/renderer/hooks';

import { HISTORY_MODAL_MAX_HEIGHT, HISTORY_MODAL_MIN_HEIGHT } from '@/renderer/constants';

import { SplitLayout } from '@/renderer/components/molecules/SplitLayout';

import { NonModal } from '@/renderer/components/atoms/modal/NonModal';
import { ThreeLineHorizontalResizer } from '@/renderer/components/atoms/lines/ThreeLineHorizontalResizer';

import { placeholderLogo } from '@/renderer/assets/base64Images';

import { languageToExt } from '@/renderer/utils';

import { ProblemHistoryItem } from './ProblemHistoryItem';
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

  const handleHistoryFilterValueChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    updateHistoryFilterValue(e.target.value);
  };

  const handleHistoryBarClick = () => {
    if (isHistoryModalOpen) {
      closeHistoryModal();
    } else {
      openHistoryModal();
    }
  };

  const verticalResizerPxOption = useMemo(() => ({ min: HISTORY_MODAL_MIN_HEIGHT, max: HISTORY_MODAL_MAX_HEIGHT }), []);

  return (
    <ProblemHistoryLayout>
      <ProblemHistoryButton onClick={handleHistoryBarClick} ref={historyButtonRef}>
        <ProblemHistoryButtonIcon />
        <ProblemHistoryButtonParagraph>방문 기록</ProblemHistoryButtonParagraph>
      </ProblemHistoryButton>

      <NonModal isOpen={isHistoryModalOpen} inset="0 auto auto auto" ref={historyModalRef} border="round">
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
                <EditingProblems />

                {isHistoryEmpty ? (
                  <ProblemHistoryModalPlaceholder>문제 히스토리가 존재하지 않습니다.</ProblemHistoryModalPlaceholder>
                ) : (
                  <ProblemHistoryModalList>
                    {histories
                      .filter((history) => `${history.number}번: ${history.name}`.includes(historyFilterValue))
                      .map((history) => {
                        return <ProblemHistoryItem key={history.number} problem={history} />;
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

function EditingProblems() {
  const [editorValue] = useStore(useShallow((s) => [s.editorValue]));

  const isExistStalingFile = Object.values(editorValue).some((languages) =>
    Object.values(languages || {}).some((value) => value.cur !== value.prev),
  );

  if (!isExistStalingFile) {
    return null;
  }

  return (
    <div
      css={(theme) => css`
        border-bottom: 1px solid ${theme.colors.primaryfg};
        padding-bottom: 4px;
        margin-bottom: 4px;
      `}
      data-testid="editing-problems"
    >
      {Object.entries(editorValue).map(([problemNumber, languages]) => {
        const staleLanguages = Object.entries(languages || {})
          .filter(([language, value]) => value.cur !== value.prev)
          .map(([language, value]) => language) as Language[];

        if (!staleLanguages.length) {
          return null;
        }

        return <EditingProblemItem key={problemNumber} problemNumber={problemNumber} languages={staleLanguages} />;
      })}
    </div>
  );
}

function EditingProblemItem({ problemNumber, languages }: { problemNumber: string; languages: Language[] }) {
  const { tierBase64, title } = useFetchProblem(problemNumber);

  const { updateLanguage } = useModifyLanguage();
  const { gotoProblem } = useModifyWebview();
  const { closeHistoryModal } = useModifyHistories();
  const { addProblemTab } = useModifyTab();

  const handleClickEditingProblem = (language: Language) => () => {
    const problem: ProblemInfo = { name: title, number: problemNumber, testCase: { inputs: [], outputs: [] } };

    gotoProblem(problem);
    addProblemTab(problem);
    updateLanguage(language);
    closeHistoryModal();
  };

  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
      `}
    >
      <div
        css={css`
          display: flex;
          align-items: center;
          gap: 0.5rem;

          padding: 2px 8px;
        `}
      >
        <img
          src={tierBase64 || placeholderLogo}
          css={css`
            width: 0.75rem;
          `}
        />
        <p>{`${problemNumber}번: ${title}`}</p>
      </div>

      <ul
        css={(theme) => css`
          border-left: 1px solid ${theme.colors.border};
          padding: 0 0 0 2px;
          margin: 0 0 0 13px;
        `}
      >
        {languages.map((language) => {
          const Icon = (() => {
            switch (language) {
              case 'C++14':
              case 'C++17':
                return Cpp;
              case 'Java11':
                return Java;
              case 'Python3':
                return Python;
              case 'node.js':
              default:
                return JavaScript;
            }
          })();

          return (
            <li
              key={language}
              css={(theme) => css`
                padding: 2px 4px;

                list-style: none;

                display: flex;
                align-items: center;
                gap: 0.5rem;
                border-radius: 4px;

                cursor: pointer;

                &:hover {
                  background-color: ${theme.colors.hover};
                }
              `}
              onClick={handleClickEditingProblem(language)}
            >
              <div
                css={css`
                  width: 0.75rem;
                  height: 0.75rem;

                  display: flex;
                  justify-content: center;
                  align-items: center;
                `}
              >
                <Icon
                  css={css`
                    width: 100%;
                    height: 100%;
                  `}
                />
              </div>
              <p
                css={css`
                  font-size: 12px;
                `}
              >{`${problemNumber}.${languageToExt(language)}`}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
