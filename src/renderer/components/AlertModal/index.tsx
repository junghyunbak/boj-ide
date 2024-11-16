import { useEffect } from 'react';

import { useShallow } from 'zustand/shallow';

import { css } from '@emotion/css';

import { useStore } from '../../store';

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
          min-height: 20%;
          max-width: 90%;
          position: absolute;
          background-color: white;
          display: flex;
          justify-content: center;
          align-items: center;
          box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.2);
          padding: 3rem 1rem;
        `}
      >
        <button
          type="button"
          className={css`
            position: absolute;
            top: 1rem;
            right: 1rem;
            padding: 0.5rem;
            margin: 0;
            background-color: transparent;
            cursor: pointer;
            border: 1px solid lightgray;
            font-size: 0.5rem;

            transition: all 0.3s ease;

            &:hover {
              box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.2);
            }
          `}
          aria-label="modal-close-button"
          onClick={() => {
            setMessage(null);
          }}
        >
          ESC / ENTER
        </button>

        <pre
          className={css`
            margin: 0;
            white-space: pre-wrap;
          `}
        >
          {message}
        </pre>
      </div>
    </div>
  );
}
