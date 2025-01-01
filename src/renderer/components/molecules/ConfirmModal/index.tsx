import { css } from '@emotion/react';
import { Modal } from '@/renderer/components/atoms/modal/Modal';
import { ActionButton } from '@/renderer/components/atoms/buttons/ActionButton';
import { Markdown } from '@/renderer/components/atoms/Markdown';
import { useConfirmModalController, useConfirmModalState } from '@/renderer/hooks';

export function ConfirmModal() {
  const { confirmCallback, confirmMessage, isConfirmModalOpen } = useConfirmModalState();
  const { cancelConfirmModal } = useConfirmModalController();

  const handleOkButtonClick = () => {
    if (confirmCallback instanceof Function) {
      confirmCallback();
    }
    cancelConfirmModal();
  };

  const handleNoButtonClick = () => {
    cancelConfirmModal();
  };

  return (
    <Modal isOpen={isConfirmModalOpen} onCloseButtonClick={handleNoButtonClick}>
      <div
        css={css`
          padding: 1rem 2rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 2rem;
          min-width: 20dvw;
          aspect-ratio: 16/9;
        `}
      >
        <Markdown>{`## 확인\n${confirmMessage}`}</Markdown>

        <div
          css={css`
            width: 100%;
            display: flex;
            justify-content: end;
            gap: 0.5rem;
          `}
        >
          <ActionButton onClick={handleOkButtonClick}>예</ActionButton>
          <ActionButton onClick={handleNoButtonClick} variant="cancel">
            아니오
          </ActionButton>
        </div>
      </div>
    </Modal>
  );
}
