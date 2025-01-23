import { useEffect } from 'react';
import { css } from '@emotion/react';
import { Modal } from '@/renderer/components/atoms/modal/Modal';
import { Markdown } from '@/renderer/components/atoms/Markdown';
import { Text } from '@/renderer/components/atoms/paragraphs/Text';
import { TextButton } from '@/renderer/components/atoms/buttons/TextButton';
import { useAlertModalController, useAlertModalState } from '@/renderer/hooks';

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
          // BUG: padding 영역 클릭 시 모달 창 닫히지 않는 문제
          padding: 10% 0;
          overflow-y: scroll;
          max-height: 100dvh;
          &::-webkit-scrollbar {
            display: none;
          }
        `}
      >
        <div
          css={css`
            border: 1px solid lightgray;
            display: flex;
            flex-direction: column;
            background-color: white;
            box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.2);
            max-width: 64rem;
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
              position: sticky;
            `}
          >
            <Text>{alertTitle}</Text>
            <TextButton onClick={handleCloseButtonClick}>닫기</TextButton>
          </div>

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
