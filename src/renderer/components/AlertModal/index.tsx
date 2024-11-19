import { useEffect } from 'react';

import { useShallow } from 'zustand/shallow';

import { css } from '@emotion/css';

import Markdown from 'react-markdown';

import { useStore } from '../../store';
import { color } from '../../../styles';

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
    <div
      className={css`
        position: absolute;
        inset: 0;

        z-index: 9999;

        display: flex;
        justify-content: center;
        align-items: center;
      `}
    >
      <div
        className={css`
          position: absolute;
          inset: 0;

          background-color: rgba(0, 0, 0, 0.2);
          backdrop-filter: blur(4px);
        `}
        onClick={() => {
          setMessage(null);
        }}
      />

      <div
        className={css`
          min-width: 50%;
          max-width: 90%;
          min-height: 20%;
          max-height: 90%;

          position: absolute;

          display: flex;
          flex-direction: column;

          box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.2);

          background-color: white;
        `}
      >
        <div
          className={css`
            display: flex;
            justify-content: end;
            width: 100%;
            border-bottom: 1px solid lightgray;
            padding: 0.5rem;
          `}
        >
          <button
            type="button"
            className={css`
              border: none;
              margin: 0;
              background-color: ${color.primaryBg};
              font-size: 0.875rem;
              color: white;
              cursor: pointer;
              padding: 0.4rem 0.8rem;
            `}
            aria-label="modal-close-button"
            onClick={() => {
              setMessage(null);
            }}
          >
            ESC / ENTER
          </button>
        </div>

        <div
          className={css`
            flex: 1;
            padding: 2rem;
            overflow-y: scroll;

            color: ${color.text};

            img {
              width: 100%;
            }

            a {
              color: ${color.primaryText};
            }
          `}
        >
          <Markdown
            components={{
              a(props) {
                return <a {...props} target="_blank" />;
              },
            }}
          >
            {message}
          </Markdown>
        </div>
      </div>
    </div>
  );
}
