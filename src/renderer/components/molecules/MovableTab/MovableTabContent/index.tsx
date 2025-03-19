import { css } from '@emotion/react';

import { getElementFromChildren } from '@/renderer/utils';

import { MovableTabContentCloseButton } from './MovableTabContentCloseButton';
import { MovableTabContentDetail } from './MovableTabContentDetail';
import { MovableTabContentIcon } from './MovableTabContentIcon';

import { useMovableTabContext } from '../MovableTabContext';

const IconType = (<MovableTabContentIcon />).type;
const CloseButtonType = (<MovableTabContentCloseButton />).type;
const DetailType = (<MovableTabContentDetail />).type;

function MovableTabContentImpl({ children }: React.PropsWithChildren) {
  const { isSelect, ghost } = useMovableTabContext();

  const Icon = getElementFromChildren(children, IconType);
  const CloseButton = getElementFromChildren(children, CloseButtonType);
  const Detail = getElementFromChildren(children, DetailType);

  return (
    <div
      css={(theme) => css`
        display: flex;
        gap: 0.5rem;
        align-items: center;

        padding: 0.5rem 0.8rem;

        ${ghost
          ? css`
              opacity: 0.5;
            `
          : css``}

        ${isSelect
          ? css`
              background-color: ${theme.colors.bg};
            `
          : css`
              background-color: ${theme.colors.tabBg};
            `}
      `}
    >
      {Icon}
      {Detail}
      {CloseButton}
    </div>
  );
}

export const MovableTabContent = Object.assign(MovableTabContentImpl, {
  MovableTabContentIcon,
  MovableTabContentDetail,
  MovableTabContentCloseButton,
});
