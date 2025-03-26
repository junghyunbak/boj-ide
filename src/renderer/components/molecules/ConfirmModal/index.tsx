import { css } from '@emotion/react';

import { useConfirmModal, useModifyConfirmModal } from '@/renderer/hooks';

import { Modal } from '@/renderer/components/atoms/modal/Modal';
import { ActionButton } from '@/renderer/components/atoms/buttons/ActionButton';
import { useEventConfirmModal } from '@/renderer/hooks/useEventConfirmModal';

export function ConfirmModal() {
  const { confirmCallback, cancelCallback, confirmMessage, isConfirmModalOpen } = useConfirmModal();

  const { cancelConfirmModal } = useModifyConfirmModal();

  useEventConfirmModal();

  const handleOkButtonClick = () => {
    if (confirmCallback instanceof Function) {
      confirmCallback();
    }

    cancelConfirmModal();
  };

  const handleNoButtonClick = () => {
    if (cancelCallback instanceof Function) {
      cancelCallback();
    }

    cancelConfirmModal();
  };

  return (
    <Modal isOpen={isConfirmModalOpen} onCloseButtonClick={handleNoButtonClick}>
      <div
        css={(theme) => css`
          padding: 1rem 1.25rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 2rem;
          min-width: 20dvw;
          aspect-ratio: 16/9;
          background-color: ${theme.colors.bg};
          border-top: 2px solid ${theme.colors.primarybg};
        `}
      >
        <pre
          css={css`
            font-family: open-sans;
          `}
        >
          {confirmMessage}
        </pre>

        <div
          css={css`
            width: 100%;
            display: flex;
            justify-content: end;
            gap: 0.5rem;
          `}
        >
          <ActionButton onClick={handleOkButtonClick} data-testid="confirm-ok-button">
            예
          </ActionButton>
          <ActionButton onClick={handleNoButtonClick} variant="cancel">
            아니오
          </ActionButton>
        </div>
      </div>
    </Modal>
  );
}
