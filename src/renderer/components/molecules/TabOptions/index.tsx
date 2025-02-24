import { useState } from 'react';

import { css } from '@emotion/react';

import { useClickOutOfModal, useTab } from '@/renderer/hooks';

import { ReactComponent as ThreeDots } from '@/renderer/assets/svgs/three-dots.svg';

import { NonModal } from '@/renderer/components/atoms/modal/NonModal';
import { ListButton } from '@/renderer/components/atoms/buttons/ListButton';

export function TabOptions() {
  const [isOpen, setIsOpen] = useState(false);

  const { clearTab } = useTab();

  const { modalRef, buttonRef } = useClickOutOfModal(() => {
    setIsOpen(false);
  });

  const handleAllTabCloseButtonClick = () => {
    clearTab();
    setIsOpen(false);
  };

  return (
    <div
      css={css`
        border-bottom: 1px solid lightgray;
        padding: 0.375rem;
      `}
    >
      <div
        css={css`
          display: flex;
          justify-content: center;
          align-items: center;
          height: fit-content;
          position: relative;
        `}
      >
        <button
          ref={buttonRef}
          type="button"
          css={css`
            display: flex;
            justify-content: center;
            align-items: center;
            border: none;
            background: none;
            padding: 0.25rem;
            cursor: pointer;
            border-radius: 4px;
            background-color: ${isOpen ? 'lightgray' : 'transparent'};

            &:hover {
              background-color: lightgray;
            }

            svg {
              width: 1rem;
              aspect-ratio: 1/1;
              color: gray;
            }
          `}
          onClick={() => setIsOpen(!isOpen)}
        >
          <ThreeDots />
        </button>

        <NonModal ref={modalRef} isOpen={isOpen} inset="100% 0 auto auto">
          <div
            css={css`
              padding: 0.25rem 0;
            `}
          >
            <ListButton onClick={handleAllTabCloseButtonClick}>문제 탭 전부 닫기</ListButton>
          </div>
        </NonModal>
      </div>
    </div>
  );
}
