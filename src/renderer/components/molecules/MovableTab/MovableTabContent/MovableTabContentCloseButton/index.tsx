import { useCallback, useState } from 'react';

import { css } from '@emotion/react';

import { XButton } from '@/renderer/components/atoms/buttons/XButton';

import { useEditor } from '@/renderer/hooks';

import { useMovableTabContext } from '../../MovableTabContext';

interface MovableTabContentCloseButtonProps {
  problemNumber?: string | null;
  onClick?: () => void;
}

export function MovableTabContentCloseButton({
  problemNumber = null,
  onClick = () => {},
}: MovableTabContentCloseButtonProps) {
  const { isSelect, isHover } = useMovableTabContext();
  const [isCloseButtonHover, setIsCloseButtonHover] = useState(false);

  const { editorLanguage, problemToStale } = useEditor();

  const handleCloseButtonClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    onClick();

    /**
     * 버블링을 차단하지 않으면 닫기 동작 뿐만 아니라, 탭 클릭 동작도 발생하기 때문에 중요한 코드
     */
    e.stopPropagation();
  };

  const handleMouseEnter = useCallback(() => {
    setIsCloseButtonHover(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsCloseButtonHover(false);
  }, []);

  const isProblem = problemNumber !== null;
  const isStale = problemToStale.get(`${problemNumber}|${editorLanguage}`);

  const isXButtonShow = isHover || isSelect;
  const isStaleBallShow = isProblem && isStale;

  const Content = (() => {
    if (isStaleBallShow) {
      if (isCloseButtonHover) {
        return <XButton />;
      }

      return <StaleBall />;
    }

    if (isHover) {
      return <XButton />;
    }

    if (isSelect) {
      return <XButton />;
    }

    return null;
  })();

  return (
    <div
      css={css`
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;

        width: 16px;
        aspect-ratio: 1/1;
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {Content}
    </div>
  );
}

function StaleBall() {
  return (
    <div
      css={(theme) => css`
        width: 8px;
        aspect-ratio: 1/1;
        border-radius: 9999px;
        background-color: ${theme.colors.fg};

        position: absolute;
      `}
    />
  );
}
