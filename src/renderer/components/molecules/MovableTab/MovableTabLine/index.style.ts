import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { zIndex } from '@/renderer/styles';

export const LineLayout = styled.div<{ dir: 'left' | 'right' }>`
  position: absolute;
  bottom: 0;

  top: 0;
  ${({ dir }) =>
    dir === 'left'
      ? css`
          left: 0;
        `
      : css`
          right: 0;
        `}
`;

export const LineBox = styled.div<{ isHidden: boolean }>`
  position: absolute;
  top: 0;
  bottom: 0;
  left: -1px;

  border: 2px solid gray;

  ${({ isHidden }) =>
    isHidden
      ? css`
          border: none;
        `
      : css``}

  z-index: ${zIndex.tab.indexLine};
`;
