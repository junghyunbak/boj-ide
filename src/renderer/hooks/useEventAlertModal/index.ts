import { useEventWindow } from '../useEventWindow';
import { useModifyAlertModal } from '../useModifyAlertModal';

export function useEventAlertModal() {
  const { closeAlertModal } = useModifyAlertModal();

  useEventWindow(
    (e) => {
      if (e.key === 'Escape' || e.key === 'Enter') {
        closeAlertModal();
      }
    },
    [closeAlertModal],
    'keydown',
  );
}
