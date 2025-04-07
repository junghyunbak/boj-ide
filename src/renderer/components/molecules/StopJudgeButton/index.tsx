import { useJudge } from '@/renderer/hooks';
import { ActionButton } from '../../atoms/buttons/ActionButton';

export function StopJudgeButton() {
  const { isJudging } = useJudge();

  if (!isJudging) {
    return null;
  }

  return (
    <ActionButton
      onClick={() => {
        window.electron.ipcRenderer.sendMessage('stop-judge', { data: undefined });
      }}
      variant="interupt"
    >
      실행 중지
    </ActionButton>
  );
}
