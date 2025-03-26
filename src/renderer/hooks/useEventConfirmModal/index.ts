import { useConfirmModal } from '../useConfirmModal';
import { useEventWindow } from '../useEventWindow';
import { useModifyConfirmModal } from '../useModifyConfirmModal';

export function useEventConfirmModal() {
  const { cancelConfirmModal } = useModifyConfirmModal();
  const { cancelCallback } = useConfirmModal();

  useEventWindow(
    (e) => {
      if (e.key === 'Escape') {
        cancelConfirmModal();

        if (cancelCallback) {
          cancelCallback();
        }
      }
    },
    [cancelConfirmModal, cancelCallback],
    'keydown',
  );
}
