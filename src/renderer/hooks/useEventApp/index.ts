import { useEffect } from 'react';

import { BOJ_DOMAIN } from '@/common/constants';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { useModifyAlertModal } from '../useModifyAlertModal';
import { useEventIpc } from '../useEventIpc';
import { useModifyWebview } from '../useModifyWebview';
import { useModifyConfirmModal } from '../useModifyConfirmModal';

export function useEventApp() {
  const { fireAlertModal } = useModifyAlertModal();
  const { fireConfirmModal } = useModifyConfirmModal();
  const { gotoUrl } = useModifyWebview();

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
      const isStaleDataExist = (() => {
        const { editorValue } = useStore.getState();

        return Object.entries(editorValue).some(([problemNumber, languages]) => {
          if (!languages) {
            return false;
          }

          return Object.entries(languages).some(([language, value]) => {
            return value.cur !== value.prev;
          });
        });
      })();

      if (isStaleDataExist) {
        fireConfirmModal('저장되지 않은 파일이 존재합니다.\n종료하시겠습니까?', () => {
          window.electron.ipcRenderer.sendMessage('quit-app', undefined);
        });
      } else {
        window.electron.ipcRenderer.sendMessage('quit-app', undefined);
      }
    },
    [fireConfirmModal],
    'check-saved',
  );

  /**
   * deep link에 의해 앱이 실행되었는지 체크
   */
  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('open-deep-link', undefined);
  }, []);
}
