import { useCallback, useState } from 'react';

import { css } from '@emotion/react';

import { XButton } from '@/renderer/components/atoms/buttons/XButton';
import { StaleBall } from '@/renderer/components/atoms/StaleBall';

import { useEditor, useStale } from '@/renderer/hooks';

import { useMovableTabContext } from '../../MovableTabContext';

interface MovableTabContentCloseButtonProps {
  problem?: Problem;
  onClick?: () => void;
}

export function MovableTabContentCloseButton({
  problem = null,
  onClick = () => {},
}: MovableTabContentCloseButtonProps) {
  const { isSelect, isHover } = useMovableTabContext();

  const [isCloseButtonHover, setIsCloseButtonHover] = useState(false);

  const { editorLanguage } = useEditor();
  const { isStale } = useStale(problem, editorLanguage);

  const handleMouseEnter = useCallback(() => {
    setIsCloseButtonHover(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsCloseButtonHover(false);
  }, []);

  const isStaleBallShow = problem && isStale;

  const handleCloseButtonClick = useCallback<React.MouseEventHandler<HTMLButtonElement>>(
    (e) => {
      /**
       * 버블링을 차단하지 않으면 닫기 동작 뿐만 아니라, 탭 클릭 동작도 발생하기 때문에 중요한 코드
       */
      e.stopPropagation();

      onClick();
    },
    [onClick],
  );

  const Content = (() => {
    if (isStaleBallShow) {
      if (isCloseButtonHover) {
        return <XButton onClick={handleCloseButtonClick} />;
      }

      return <StaleBall data-testid={`stale-ball-${problem.number}`} />;
    }

    if (isHover) {
      return <XButton onClick={handleCloseButtonClick} />;
    }

    if (isSelect) {
      return <XButton onClick={handleCloseButtonClick} />;
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
