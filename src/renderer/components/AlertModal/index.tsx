import { useEffect } from 'react';
import { useShallow } from 'zustand/shallow';
import Markdown from 'react-markdown';
import { useStore } from '@/renderer/store';
import {
  AlertModalContentBox,
  AlertModalContentHeaderBox,
  AlertModalContentHeaderCloseButton,
  AlertModalContentMarkdownBox,
  AlertModalDimmedBox,
  AlertModalLayout,
} from './index.styles';

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

  if (!message) {
    return null;
  }

  return (
    <AlertModalLayout>
      <AlertModalDimmedBox
        onClick={() => {
          setMessage(null);
        }}
      />

      <AlertModalContentBox>
        <AlertModalContentHeaderBox>
          <AlertModalContentHeaderCloseButton
            type="button"
            aria-label="modal-close-button"
            onClick={() => {
              setMessage(null);
            }}
          >
            ESC / ENTER
          </AlertModalContentHeaderCloseButton>
        </AlertModalContentHeaderBox>

        <AlertModalContentMarkdownBox>
          <Markdown
            components={{
              h1(props) {
                return (
                  <div className="headline">
                    <h1 {...props} />
                  </div>
                );
              },
              h2(props) {
                return (
                  <div className="headline">
                    <h2 {...props} />
                  </div>
                );
              },
              a(props) {
                return <a {...props} target="_blank" />;
              },
            }}
          >
            {message}
          </Markdown>
        </AlertModalContentMarkdownBox>
      </AlertModalContentBox>
    </AlertModalLayout>
  );
}
