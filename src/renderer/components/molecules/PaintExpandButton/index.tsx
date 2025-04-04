import { css } from '@emotion/react';

import { ReactComponent as Expand } from '@/renderer/assets/svgs/expand.svg';
import { ReactComponent as Shrink } from '@/renderer/assets/svgs/shrink.svg';

import { useLayout, useModifyLayout, usePaint } from '@/renderer/hooks';

export function PaintExpandButton() {
  const { paintRef } = usePaint();
  const { isPaintExpand } = useLayout();

  const { updateIsPaintExpand } = useModifyLayout();

  const handleExpandButtonClick = () => {
    updateIsPaintExpand(!isPaintExpand);
  };

  const handleButtonMouseDown: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    /**
     * 버튼 클릭으로 인한 fabric canvas의 focus blur를 방지
     */
    e.preventDefault();

    paintRef.current?.focus();
  };

  return (
    <button
      css={(theme) => css`
        border: none;

        color: ${theme.colors.fg};
        background: none;

        cursor: pointer;
        pointer-events: auto;

        display: flex;
        justify-content: center;
        align-items: center;

        width: fit-content;
        padding: 0.5rem;

        svg {
          width: 1rem;
        }
      `}
      type="button"
      onClick={handleExpandButtonClick}
      onMouseDown={handleButtonMouseDown}
    >
      {isPaintExpand ? <Shrink /> : <Expand />}
    </button>
  );
}
