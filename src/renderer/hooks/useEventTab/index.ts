import { useProblem } from '../useProblem';
import { useTab } from '../useTab';
import { useEventIpc } from '../useEventIpc';
import { useConfirmModalController } from '../useConfirmModal';

export function useEventTab() {
  const { problem } = useProblem();
  const { problemTabCount } = useTab();

  const { fireConfirmModal } = useConfirmModalController();

  useEventIpc(
    () => {
      if (problemTabCount === 0 || !problem) {
        fireConfirmModal('종료하시겠습니까?', () => {
          window.electron.ipcRenderer.sendMessage('quit-app');
        });
      }
    },
    [problemTabCount, problem, fireConfirmModal],
    'close-tab',
  );
}
