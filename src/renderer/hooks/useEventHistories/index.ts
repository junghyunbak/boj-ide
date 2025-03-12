import { useEventWindow } from '../useEventWindow';
import { useHistories } from '../useHistories';
import { useModifyHistories } from '../useModifyHistories';

export function useEventHistories() {
  const { isHistoryModalOpen, historyModalInputRef } = useHistories();
  const { closeHistoryModal } = useModifyHistories();

  useEventWindow(
    (e) => {
      if (isHistoryModalOpen) {
        switch (e.key) {
          case 'ArrowDown':
          case 'ArrowUp': {
            e.preventDefault();

            const historyItems = Array.from(document.querySelectorAll<HTMLDivElement>('.history-item'));

            if (historyItems.length === 0) {
              break;
            }

            const idx = historyItems.findIndex((item) => item === document.activeElement);

            const nextItem =
              idx === -1
                ? historyItems[e.key === 'ArrowUp' ? historyItems.length - 1 : 0]
                : historyItems[(idx + (e.key === 'ArrowUp' ? -1 : 1) + historyItems.length) % historyItems.length];

            nextItem.focus();

            break;
          }
          case 'Enter': {
            const item = document.activeElement;

            if (item instanceof HTMLElement) {
              item.click();
            }
            break;
          }
          case 'Escape': {
            closeHistoryModal();
            break;
          }
          default: {
            historyModalInputRef.current?.focus();

            break;
          }
        }
      }
    },
    [isHistoryModalOpen, closeHistoryModal, historyModalInputRef],
    'keydown',
  );
}
