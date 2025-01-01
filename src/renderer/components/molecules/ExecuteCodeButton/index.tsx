import { ActionButton } from '@/renderer/components/atoms/buttons/ActionButton';
import { useJudge, useProblem } from '@/renderer/hooks';

// <유닛 테스트>
// 역할: 버튼을 눌러 채점을 시작한다.
// [ ]: 채점중일 경우 버튼이 비활성화되어야 한다.
// [ ]: 문제가 선택되어있지 않을 경우 버튼이 비활성화되어야 한다.
export function ExecuteCodeButton() {
  const { problem } = useProblem();
  const { isJudging, startJudge } = useJudge();

  const handleExecuteButtonClick = () => {
    startJudge();
  };

  return (
    <ActionButton onClick={handleExecuteButtonClick} disabled={!problem || isJudging}>
      코드 실행
    </ActionButton>
  );
}
