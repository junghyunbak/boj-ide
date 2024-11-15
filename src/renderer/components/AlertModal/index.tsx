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
        `}
      />
      <div
        className={css`
          min-width: 50%;
          min-height: 30%;
          position: absolute;
          background-color: white;
          border-radius: 1.5rem;
          display: flex;
          justify-content: center;
          align-items: center;
        `}
      >
        <button
          type="button"
          className={css`
            position: absolute;
            top: 1rem;
            right: 1rem;
          `}
          onClick={() => {
            setMessage(null);
          }}
        >
          닫기
        </button>

        <p>{message}</p>
      </div>
    </div>
  );
}
