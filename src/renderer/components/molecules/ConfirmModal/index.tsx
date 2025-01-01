import { Modal } from '@/renderer/components/atoms/modal/Modal';
import { ActionButton } from '@/renderer/components/atoms/buttons/ActionButton';
import { Markdown } from '@/renderer/components/atoms/Markdown';
import { css } from '@emotion/react';
import { useConfirmModal } from '@/renderer/hooks/useConfirmModal';

export function ConfirmModal() {
  const { isConfirmModalOpen, confirmMessage, approveConfirmModal, cancelConfirmModal } = useConfirmModal();

  const handleOkButtonClick = () => {
    approveConfirmModal();
  };

  const handleNoButtonClick = () => {
    cancelConfirmModal();
  };

  return (
    <Modal isOpen={isConfirmModalOpen} onCloseButtonClick={handleNoButtonClick}>
      <div
        css={css`
          padding: 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        `}
      >
        <Markdown>{confirmMessage}</Markdown>

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
