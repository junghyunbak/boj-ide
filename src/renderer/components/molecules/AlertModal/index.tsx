import { useEffect } from 'react';
import { useShallow } from 'zustand/shallow';
import { useStore } from '@/renderer/store';
import { css } from '@emotion/react';
import { Modal } from '@/renderer/components/atoms/modal/Modal';
import { ActionButton } from '@/renderer/components/atoms/buttons/ActionButton';
import { Markdown } from '@/renderer/components/atoms/Markdown';

export function AlertModal() {
  const [message, setMessage] = useStore(useShallow((s) => [s.message, s.setMessage]));

  useEffect(() => {
    if (!message) {
      return () => {};
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter') {
        setMessage(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [message, setMessage]);

  const handleCloseButtonClick = () => {
    setMessage(null);
  };

  const isOpen = message !== null;

  return (
    <Modal isOpen={isOpen} onCloseButtonClick={handleCloseButtonClick}>
      <div
        css={css`
          padding: 0.5rem;
          border-bottom: 1px solid lightgray;
          display: flex;
          justify-content: end;
        `}
      >
        <ActionButton onClick={handleCloseButtonClick}>ESC / ENTER</ActionButton>
      </div>

      <div
        css={css`
          overflow-y: scroll;
          padding: 2rem;
        `}
      >
        <Markdown>{message || ''}</Markdown>
      </div>
    </Modal>
  );
}
