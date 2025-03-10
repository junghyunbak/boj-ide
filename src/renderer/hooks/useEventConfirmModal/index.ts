import { useEventWindow } from '../useEventWindow';
import { useModifyConfirmModal } from '../useModifyConfirmModal';

export function useEventConfirmModal() {
  const { cancelConfirmModal } = useModifyConfirmModal();

  useEventWindow(
    (e) => {
      if (e.key === 'Escape') {
        cancelConfirmModal();
      }
    },
    [cancelConfirmModal],
    'keydown',
  );
}
