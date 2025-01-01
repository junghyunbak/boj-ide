import { useEffect } from 'react';
import { css } from '@emotion/react';
import { Modal } from '@/renderer/components/atoms/modal/Modal';
import { Markdown } from '@/renderer/components/atoms/Markdown';
import { Text } from '@/renderer/components/atoms/paragraphs/Text';
import { TextButton } from '@/renderer/components/atoms/buttons/TextButton';
import { useAlertModalController, useAlertModalState } from '@/renderer/hooks/useAlertModal';

export function AlertModal() {
  const { alertTitle, alertContent, isAlertModalOpen } = useAlertModalState();
  const { closeAlertModal } = useAlertModalController();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter') {
        closeAlertModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeAlertModal]);

  const handleCloseButtonClick = () => {
    closeAlertModal();
  };

  return (
    <Modal isOpen={isAlertModalOpen} onCloseButtonClick={handleCloseButtonClick}>
      <div
        css={css`
          border: 1px solid lightgray;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        `}
      >
        <div
          css={css`
            padding: 0.5rem 1rem;
            border-bottom: 1px solid lightgray;
            background-color: #f5f5f5;
            display: flex;
            justify-content: space-between;
            align-items: center;
          `}
        >
          <Text>{alertTitle}</Text>
          <TextButton onClick={handleCloseButtonClick}>닫기</TextButton>
        </div>

        <div
          css={css`
            flex: 1;
            overflow: hidden;
            overflow-y: scroll;
          `}
        >
          <div
            css={css`
              padding: 1rem;
            `}
          >
            <Markdown>{alertContent || ''}</Markdown>
          </div>
        </div>
      </div>
    </Modal>
  );
}
