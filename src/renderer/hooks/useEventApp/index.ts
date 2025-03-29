import { useEffect } from 'react';

import { BOJ_DOMAIN } from '@/common/constants';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { useModifyAlertModal } from '../useModifyAlertModal';
import { useEventIpc } from '../useEventIpc';
import { useModifyWebview } from '../useModifyWebview';
import { useModifyConfirmModal } from '../useModifyConfirmModal';
import { useModifyHistories } from '../useModifyHistories';
import { useModifyEditor } from '../useModifyEditor';

export function useEventApp() {
  const { fireAlertModal } = useModifyAlertModal();
  const { fireConfirmModal } = useModifyConfirmModal();
  const { gotoUrl } = useModifyWebview();
  const { openHistoryModal } = useModifyHistories();
  const { getEditingFileIsExist } = useModifyEditor();

  const [setBaekjoonhubExtensionId] = useStore(useShallow((s) => [s.setBaekjoonhubExtensionId]));

  useEventIpc(
    ({ data: { message } }) => {
      fireAlertModal('에러 발생', message);
    },
    [fireAlertModal],
    'occur-error',
  );

  useEventIpc(
    ({ data: { problemNumber } }) => {
      gotoUrl(`https://${BOJ_DOMAIN}/problem/${problemNumber}`);
    },
    [gotoUrl],
    'open-problem',
  );

  useEventIpc(
    ({ data: { extensionId } }) => {
      setBaekjoonhubExtensionId(extensionId);
    },
    [setBaekjoonhubExtensionId],
    'set-baekjoonhub-id',
  );

  useEventIpc(
    () => {
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
    [fireConfirmModal, openHistoryModal, getEditingFileIsExist],
    'check-saved',
  );
}
