import { useCallback } from 'react';

import { useFetchProblem, useTab, useModifyDailyProblems, useModifyTab, useModifyWebview } from '@/renderer/hooks';

import { placeholderLogo } from '@/renderer/assets/base64Images';

import { MovableTab } from '../MovableTab';

interface TabProblemGhostProps {
  num: string;
}

export function TabProblemGhost({ num }: TabProblemGhostProps) {
  const { tabs } = useTab();

  const { addProblemTab } = useModifyTab();
  const { gotoProblem } = useModifyWebview();
  const { removeDailyProblemTab } = useModifyDailyProblems();

  const { tierBase64, title } = useFetchProblem(num);

  const handleCloseButtonClick = useCallback(() => {
    removeDailyProblemTab(num);
  }, [removeDailyProblemTab, num]);

  const handleTabClick = useCallback(() => {
    const tmpProblem: ProblemInfo = { number: num, name: title, testCase: { inputs: [], outputs: [] } };

    removeDailyProblemTab(num);
    addProblemTab(tmpProblem);
    gotoProblem(tmpProblem);
  }, [num, title, removeDailyProblemTab, addProblemTab, gotoProblem]);

  if (!title) {
    return null;
  }

  return (
    <MovableTab tabIndex={tabs.length} onClick={handleTabClick} ghost>
      <MovableTab.MovableTabBottomBorder />
      <MovableTab.MovableTabTopBorder />
      <MovableTab.MovableTabRightBorder />
      <MovableTab.MovableTabLeftBorder />

      <MovableTab.MovableTabContent>
        <MovableTab.MovableTabContent.MovableTabContentIcon src={tierBase64 || placeholderLogo} />
        <MovableTab.MovableTabContent.MovableTabContentDetail>
          {`${num}번: ${title}`}
        </MovableTab.MovableTabContent.MovableTabContentDetail>
        <MovableTab.MovableTabContent.MovableTabContentCloseButton onClick={handleCloseButtonClick} />
      </MovableTab.MovableTabContent>
    </MovableTab>
  );
}
