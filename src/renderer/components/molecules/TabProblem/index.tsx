import { useFetchProblem, useModifyTab, useModifyWebview, useProblem, useEventIpc } from '@/renderer/hooks';

import { MovableTab } from '@/renderer/components/molecules/MovableTab';

import { placeholderLogo } from '@/renderer/assets/base64Images';

interface TabProblemProps {
  tab: ProblemInfo;
  index: number;
}

export function TabProblem({ tab, index }: TabProblemProps) {
  const { problem } = useProblem();

  const { removeTab } = useModifyTab();
  const { gotoProblem } = useModifyWebview();

  const { tierBase64 } = useFetchProblem(tab.number);

  const isSelect = problem?.number === tab.number;

  useEventIpc(
    () => {
      if (isSelect) {
        removeTab(index, isSelect);
      }
    },
    [index, isSelect, removeTab],
    'close-tab',
  );

  const handleTabCloseButtonClick = () => {
    removeTab(index, isSelect);
  };

  const handleTabClick = () => {
    gotoProblem(tab);
  };

  return (
    <MovableTab isSelect={isSelect} tabIndex={index} onClick={handleTabClick}>
      <MovableTab.MovableTabTopBorder />
      <MovableTab.MovableTabBottomBorder />
      <MovableTab.MovableTabLeftBorder />
      <MovableTab.MovableTabRightBorder />

      {index === 0 && <MovableTab.MovableTabLeftLine />}

      <MovableTab.MovableTabContent>
        <MovableTab.MovableTabContent.MovableTabContentIcon src={tierBase64 || placeholderLogo} />
        <MovableTab.MovableTabContent.MovableTabContentDetail>
          {`${tab.number}번: ${tab.name}`}
        </MovableTab.MovableTabContent.MovableTabContentDetail>
        <MovableTab.MovableTabContent.MovableTabContentCloseButton onClick={handleTabCloseButtonClick} problem={tab} />
      </MovableTab.MovableTabContent>

      <MovableTab.MovableTabRightLine />
    </MovableTab>
  );
}
