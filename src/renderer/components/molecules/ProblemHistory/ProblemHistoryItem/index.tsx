import { memo, useCallback } from 'react';

import { placeholderLogo } from '@/renderer/assets/base64Images';

import { XButton } from '@/renderer/components/atoms/buttons/XButton';

import { useFetchProblem, useModifyWebview, useModifyHistories } from '@/renderer/hooks';

import {
  ProblemHistoryItem,
  ProblemHistoryItemContentBox,
  ProblemHistoryItemContentIconImage,
  ProblemHistoryItemContentParagraph,
  ProblmHistoryItemCloseButtonBox,
} from './index.style';

interface ProblemHistoriItemProps {
  problem: ProblemInfo;
}

export const ProblemHistoriItem = memo(({ problem }: ProblemHistoriItemProps) => {
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
    <ProblemHistoryItem className="history-item" tabIndex={-1} onClick={handleItemClick}>
      <ProblemHistoryItemContentBox>
        <ProblemHistoryItemContentIconImage src={tierBase64 || placeholderLogo} />
        <ProblemHistoryItemContentParagraph>{`${problem.number}번: ${title}`}</ProblemHistoryItemContentParagraph>
      </ProblemHistoryItemContentBox>

      <ProblmHistoryItemCloseButtonBox>
        <XButton onClick={handleDeleteButtonClick} />
      </ProblmHistoryItemCloseButtonBox>
    </ProblemHistoryItem>
  );
});
