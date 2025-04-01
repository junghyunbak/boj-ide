import { useModifyAlertModal, useProblem } from '@/renderer/hooks';

import { langToJudgeInfo } from '@/common/constants';

import { TransparentButton } from '@/renderer/components/atoms/buttons/TransparentButton';

const createJudgeInfoTemplate = (language: string, compileCmd: string, executeCmd: string) => `
### ${language}
|||
|-|-|
|컴파일|${compileCmd ? `<code class="language-zsh">${compileCmd}</code>` : ''}|
|실행|<code class="language-zsh">${executeCmd}</code>|
`;

export function JudgeInfoButton() {
  const { problem } = useProblem();
  const { fireAlertModal } = useModifyAlertModal();

  const handleJudgeInfoButtonClick = () => {
    const problemNumber = problem?.number || '1000';

    const content = Object.entries(langToJudgeInfo)
      .map(([language, judgeInfo]) => {
        const isCLang = language === 'C++14' || language === 'C++17';

        const compileCmd = judgeInfo.compile
          ? judgeInfo.compile(problemNumber)[window.electron.platform]?.toString() || ''
          : '';
        const executeCmd = isCLang
          ? `${window.electron.platform === 'win32' ? `${problemNumber}.exe` : `./${problemNumber}`}`
          : `${judgeInfo.program} ${judgeInfo.executeArgs(problemNumber)[window.electron.platform]?.join(' ')}`;

        return createJudgeInfoTemplate(language, compileCmd, executeCmd);
      })
      .join('\n');

    fireAlertModal('채점 정보', content);
  };

  return (
    <TransparentButton size="small" onClick={handleJudgeInfoButtonClick}>
      채점 정보
    </TransparentButton>
  );
}
