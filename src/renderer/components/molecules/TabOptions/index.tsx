import { useState } from 'react';

import { css } from '@emotion/react';

import { useClickOutOfModal, useTab, useWebview } from '@/renderer/hooks';

import { ReactComponent as ThreeDots } from '@/renderer/assets/svgs/three-dots.svg';

import { NonModal } from '@/renderer/components/atoms/modal/NonModal';
import { ListButton } from '@/renderer/components/atoms/buttons/ListButton';

import { BOJ_DOMAIN } from '@/common/constants';

export function TabOptions() {
  const [isOpen, setIsOpen] = useState(false);

  const { clearTab } = useTab();
  const { gotoUrl } = useWebview();
  const { modalRef, buttonRef } = useClickOutOfModal(() => {
    setIsOpen(false);
  });

  const handleAllTabCloseButtonClick = () => {
    clearTab();
    gotoUrl(`https://${BOJ_DOMAIN}/problemset`);
    setIsOpen(false);
  };

  return (
    <div
      css={css`
        display: flex;
        justify-content: center;
        align-items: center;
        height: fit-content;
        position: relative;
        margin-right: 0.5rem;
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
        <ListButton onClick={handleAllTabCloseButtonClick}>탭 모두 닫기</ListButton>
      </NonModal>
    </div>
  );
}
