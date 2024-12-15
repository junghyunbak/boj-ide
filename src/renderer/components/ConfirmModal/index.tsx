import { useShallow } from 'zustand/shallow';
import { useStore } from '@/renderer/store';
import { SubmitButton } from '@/renderer/components/core/button/SubmitButton';
import {
  ConfirmModalContentBox,
  ConfirmModalLayout,
  ConfirmModalMessagePre,
  ConfirmModalYesOrNoBox,
} from './index.styles';

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

  if (!callback) {
    return null;
  }

  return (
    <ConfirmModalLayout>
      <ConfirmModalContentBox>
        <ConfirmModalMessagePre>{confirmMessage}</ConfirmModalMessagePre>

        <ConfirmModalYesOrNoBox>
          <SubmitButton onClick={handleOkButtonClick}>예</SubmitButton>
          <SubmitButton onClick={handleNoButtonClick}>아니오</SubmitButton>
        </ConfirmModalYesOrNoBox>
      </ConfirmModalContentBox>
    </ConfirmModalLayout>
  );
}
