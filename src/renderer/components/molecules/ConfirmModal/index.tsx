import { useShallow } from 'zustand/shallow';
import { useStore } from '@/renderer/store';
import { Modal } from '@/renderer/components/atoms/modal/Modal';
import { ActionButton } from '@/renderer/components/atoms/buttons/ActionButton';
import { Text } from '@/renderer/components/atoms/paragraphs/Text';
import { css } from '@emotion/react';

export function ConfirmModal() {
  const [confirmMessage, callback, setConfirm] = useStore(
    useShallow((s) => [s.confirmMessage, s.callback, s.setConfirm]),
  );

  const handleOkButtonClick = () => {
    if (!callback) {
      return;
    }

    callback();

    setConfirm('', null);
  };

  const handleNoButtonClick = () => {
    setConfirm('', null);
  };

  const isOpen = callback instanceof Function;

  return (
    <Modal isOpen={isOpen} onCloseButtonClick={handleNoButtonClick}>
      <div
        css={css`
          padding: 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        `}
      >
        <Text>{confirmMessage}</Text>

        <div
          css={css`
            display: flex;
            gap: 0.5rem;
          `}
        >
          <ActionButton onClick={handleOkButtonClick}>예</ActionButton>
          <ActionButton onClick={handleNoButtonClick}>아니오</ActionButton>
        </div>
      </div>
    </Modal>
  );
}
