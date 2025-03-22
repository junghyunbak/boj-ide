import { useCallback, useRef, useState } from 'react';

import { css } from '@emotion/react';

import {
  useModifyDailyProblems,
  useDailyProblem,
  useModifyTab,
  useEventClickOutOfModal,
  useEventWindow,
} from '@/renderer/hooks';

import { ReactComponent as ThreeDots } from '@/renderer/assets/svgs/three-dots.svg';

import { NonModal } from '@/renderer/components/atoms/modal/NonModal';
import { ListButton } from '@/renderer/components/atoms/buttons/ListButton';

export function TabOptions() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const { toggleActiveDailyProblem } = useModifyDailyProblems();
  const { clearTab } = useModifyTab();

  const { activeDailyProblem } = useDailyProblem();

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  useEventClickOutOfModal(buttonRef, modalRef, closeModal);

  useEventWindow(
    (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    },
    [closeModal],
    'keydown',
  );

  const handleButtonClick = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleAllTabCloseButtonClick = () => {
    clearTab();
    closeModal();
  };

  const handleDailyProblemActiveToggleButtonClick = () => {
    toggleActiveDailyProblem();
    closeModal();
  };

  return (
    <div
      css={(theme) => css`
        padding: 0.375rem;
        border-bottom: 1px solid ${theme.colors.border};
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
          css={(theme) => css`
            display: flex;
            justify-content: center;
            align-items: center;
            border: none;
            background: none;
            padding: 0.25rem;
            border-radius: 4px;
            cursor: pointer;

            ${isModalOpen
              ? css`
                  background-color: ${theme.colors.active};
                `
              : css``}

            &:hover {
              background-color: ${theme.colors.active};
            }

            svg {
              width: 1rem;
              aspect-ratio: 1/1;
              color: ${theme.colors.fg};
            }
          `}
          onClick={handleButtonClick}
        >
          <ThreeDots />
        </button>

        <NonModal ref={modalRef} isOpen={isModalOpen} inset="100% 0 auto auto">
          <div
            css={css`
              padding: 0.25rem 0;
            `}
          >
            <ListButton onClick={handleAllTabCloseButtonClick}>문제 탭 전부 닫기</ListButton>
            <ListButton
              onClick={handleDailyProblemActiveToggleButtonClick}
            >{`일일 문제 추천 ${activeDailyProblem ? '비활성화' : '활성화'}`}</ListButton>
          </div>
        </NonModal>
      </div>
    </div>
  );
}
