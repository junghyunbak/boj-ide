import { useShallow } from 'zustand/shallow';
import { css } from '@emotion/css';
import { useStore } from '../../store';
import { SubmitButton } from '../core/button/SubmitButton';
import { color } from '../../../styles';

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
    <div
      className={css`
        position: absolute;
        inset: 0;
        display: flex;
        justify-content: center;
        align-items: center;
      `}
    >
      <div
        className={css`
          background-color: white;
          padding: 1rem;
          display: flex;
          align-items: center;
          flex-direction: column;
          border: 1px solid lightgray;
          gap: 1rem;
        `}
      >
        <p
          className={css`
            margin: 0;
            color: ${color.text};
          `}
        >
          {confirmMessage}
        </p>

        <div
          className={css`
            display: flex;
            gap: 0.5rem;
          `}
        >
          <SubmitButton onClick={handleOkButtonClick}>예</SubmitButton>
          <SubmitButton onClick={handleNoButtonClick}>아니오</SubmitButton>
        </div>
      </div>
    </div>
  );
}
