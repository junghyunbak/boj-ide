import { css } from '@emotion/react';

import { getElementFromChildren } from '@/renderer/utils';

import { MovableTabContentCloseButton } from './MovableTabContentCloseButton';
import { MovableTabContentDetail } from './MovableTabContentDetail';
import { useMovableTabContext } from '../MovableTabContext';

const CloseButtonType = (<MovableTabContentCloseButton />).type;
const DetailType = (<MovableTabContentDetail />).type;

function MovableTabContentImpl({ children }: React.PropsWithChildren) {
  const { isSelect } = useMovableTabContext();

  const CloseButton = getElementFromChildren(children, CloseButtonType);
  const Detail = getElementFromChildren(children, DetailType);

  return (
    <div
      css={(theme) => css`
        display: flex;
        gap: 0.5rem;
        align-items: center;

        padding: 0.5rem 0.8rem;

        ${isSelect
          ? css`
              background-color: ${theme.colors.bg};
            `
          : css`
              background-color: ${theme.colors.tabBg};
            `}

        &:hover * {
          opacity: 1;
        }
      `}
    >
      {Detail}
      {CloseButton}
    </div>
  );
}

export const MovableTabContent = Object.assign(MovableTabContentImpl, {
  MovableTabContentCloseButton,
  MovableTabContentDetail,
});
