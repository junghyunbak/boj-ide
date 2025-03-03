import { useFetchProblem, useProblem, useTab, useWebviewController } from '@/renderer/hooks';

import { MovableTab } from '@/renderer/components/molecules/MovableTab';
import { placeholderLogo } from '@/renderer/assets/base64Images';

interface TabProblemProps {
  tab: ProblemInfo;
  index: number;
}

export function TabProblem({ tab, index }: TabProblemProps) {
  const { problem } = useProblem();
  const { removeTab } = useTab();
  const { gotoProblem } = useWebviewController();
  const { tierBase64 } = useFetchProblem(tab.number);

  const isSelect = problem?.number === tab.number;

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

      <MovableTab.MovableTabLeftLine />

      <MovableTab.MovableTabContent>
        <MovableTab.MovableTabContent.MovableTabContentIcon src={tierBase64 || placeholderLogo} />
        <MovableTab.MovableTabContent.MovableTabContentDetail>
          {`${tab.number}번: ${tab.name}`}
        </MovableTab.MovableTabContent.MovableTabContentDetail>
        <MovableTab.MovableTabContent.MovableTabContentCloseButton onClick={handleTabCloseButtonClick} />
      </MovableTab.MovableTabContent>

      <MovableTab.MovableTabRightLine />
    </MovableTab>
  );
}
