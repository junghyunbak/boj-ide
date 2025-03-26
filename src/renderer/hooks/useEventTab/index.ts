import { useProblem } from '../useProblem';
import { useTab } from '../useTab';
import { useEventIpc } from '../useEventIpc';
import { useModifyEditor } from '../useModifyEditor';
import { useModifyConfirmModal } from '../useModifyConfirmModal';
import { useModifyHistories } from '../useModifyHistories';

export function useEventTab() {
  const { problem } = useProblem();
  const { problemTabCount } = useTab();

  const { getEditingFileIsExist } = useModifyEditor();
  const { fireConfirmModal } = useModifyConfirmModal();
  const { openHistoryModal } = useModifyHistories();

  useEventIpc(
    () => {
      if (problem && problemTabCount > 0) {
        return;
      }

      const isStaleDataExist = getEditingFileIsExist();

      if (isStaleDataExist) {
        fireConfirmModal(
          '저장되지 않은 파일이 존재합니다.\n종료하시겠습니까?',
          () => {
            window.electron.ipcRenderer.sendMessage('quit-app', undefined);
          },
          () => {
            openHistoryModal();
          },
        );
      } else {
        window.electron.ipcRenderer.sendMessage('quit-app', undefined);
      }
    },
    [problemTabCount, fireConfirmModal, openHistoryModal, getEditingFileIsExist],
    'close-tab',
  );
}
