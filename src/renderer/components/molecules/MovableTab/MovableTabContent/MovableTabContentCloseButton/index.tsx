import { css } from '@emotion/react';

import { XButton } from '@/renderer/components/atoms/buttons/XButton';

import { useMovableTabContext } from '../../MovableTabContext';

interface MovableTabContentCloseButtonProps {
  onClick?: () => void;
}

export function MovableTabContentCloseButton({ onClick = () => {} }: MovableTabContentCloseButtonProps) {
  const { isSelect } = useMovableTabContext();

  const handleCloseButtonClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    onClick();

    /**
     * 버블링을 차단하지 않으면 닫기 동작 뿐만 아니라, 탭 클릭 동작도 발생하기 때문에 중요한 코드
     */
    e.stopPropagation();
  };

  return (
    <div
      css={css`
        opacity: ${isSelect ? 1 : 0};
      `}
    >
      <XButton onClick={handleCloseButtonClick} />
    </div>
  );
}
