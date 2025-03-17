import { useEffect } from 'react';

import { BOJ_DOMAIN } from '@/common/constants';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { useModifyAlertModal } from '../useModifyAlertModal';
import { useEventIpc } from '../useEventIpc';
import { useModifyWebview } from '../useModifyWebview';

export function useEventApp() {
  const { fireAlertModal } = useModifyAlertModal();
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

  /**
   * deep link에 의해 앱이 실행되었는지 체크
   */
  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('open-deep-link', undefined);
  }, []);
}
