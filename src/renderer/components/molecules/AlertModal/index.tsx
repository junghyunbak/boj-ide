import { Modal } from '@/renderer/components/atoms/modal/Modal';
import { TextButton } from '@/renderer/components/atoms/buttons/TextButton';
import { Markdown } from '@/renderer/components/atoms/Markdown';

import { useModifyAlertModal, useAlertModal, useEventAlertModal } from '@/renderer/hooks';
import {
  AlertBox,
  AlertContentBox,
  AlertHeaderBox,
  AlertHeaderParagraph,
  ScrollBox,
  ScrollPadding,
} from './index.style';

export function AlertModal() {
  const { alertTitle, alertContent, isAlertModalOpen } = useAlertModal();

  const { closeAlertModal } = useModifyAlertModal();

  useEventAlertModal();

  const handleCloseButtonClick = () => {
    closeAlertModal();
  };

  return (
    <Modal isOpen={isAlertModalOpen} onCloseButtonClick={handleCloseButtonClick}>
      <ScrollBox>
        <ScrollPadding onClick={handleCloseButtonClick} />
        <AlertBox>
          <AlertHeaderBox>
            <AlertHeaderParagraph>{alertTitle}</AlertHeaderParagraph>
            <TextButton onClick={handleCloseButtonClick}>닫기</TextButton>
          </AlertHeaderBox>

          <AlertContentBox>
            <Markdown>{alertContent || ''}</Markdown>
          </AlertContentBox>
        </AlertBox>
        <ScrollPadding onClick={handleCloseButtonClick} />
      </ScrollBox>
    </Modal>
  );
}
