import { memo, useCallback, useState } from 'react';

import { placeholderLogo } from '@/renderer/assets/base64Images';

import { XButton } from '@/renderer/components/atoms/buttons/XButton';
import { StaleBall } from '@/renderer/components/atoms/StaleBall';

import { useFetchProblem, useModifyWebview, useModifyHistories, useStale, useLanguage } from '@/renderer/hooks';

import {
  ProblemHistoryItemLayout,
  ProblemHistoryItemContentBox,
  ProblemHistoryItemContentIconImage,
  ProblemHistoryItemContentParagraph,
  ProblmHistoryItemCloseButtonBox,
} from './index.style';

interface ProblemHistoriItemProps {
  problem: ProblemInfo;
}

// TODO: isFocus 상태 생성 후, 포커스 시 X버튼 보이도록 변경
export const ProblemHistoryItem = memo(({ problem }: ProblemHistoriItemProps) => {
  const [isHover, setIsHover] = useState(false);

  const { tierBase64, title } = useFetchProblem(problem.number);
  const { language } = useLanguage();
  const { isStale } = useStale(problem, language);

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

  const handleMouseEnter = useCallback(() => {
    setIsHover(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHover(false);
  }, []);

  const Content = (() => {
    if (isHover) {
      return <XButton onClick={handleDeleteButtonClick} />;
    }

    if (isStale) {
      return <StaleBall />;
    }

    return null;
  })();

  return (
    <ProblemHistoryItemLayout
      className="history-item"
      tabIndex={-1}
      onClick={handleItemClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <ProblemHistoryItemContentBox>
        <ProblemHistoryItemContentIconImage src={tierBase64 || placeholderLogo} />
        <ProblemHistoryItemContentParagraph>{`${problem.number}번: ${title}`}</ProblemHistoryItemContentParagraph>
      </ProblemHistoryItemContentBox>

      <ProblmHistoryItemCloseButtonBox>{Content}</ProblmHistoryItemCloseButtonBox>
    </ProblemHistoryItemLayout>
  );
});
