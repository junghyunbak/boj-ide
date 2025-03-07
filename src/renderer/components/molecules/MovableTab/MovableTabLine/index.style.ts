import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { zIndex } from '@/renderer/styles';

export const LineLayout = styled.div<{ dir: 'left' | 'right' }>`
  position: absolute;
  top: 0;
  bottom: 0;

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

  border-left: 2px solid ${(props) => props.theme.colors.accent};

  ${({ isHidden }) =>
    isHidden
      ? css`
          border: none;
        `
      : css``}

  z-index: ${zIndex.tab.indexLine};
`;
