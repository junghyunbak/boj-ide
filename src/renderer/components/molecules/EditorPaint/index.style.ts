import styled from '@emotion/styled';

import { color, zIndex } from '@/renderer/styles';

export const PaintLayout = styled.div<{ isExpand: boolean }>`
  width: 100%;
  height: 100%;

  position: ${({ isExpand }) => (isExpand ? 'absolute' : 'relative')};
  inset: 0;
  z-index: ${({ isExpand }) => (isExpand ? zIndex.paint.expanded : zIndex.paint.default)};

  background-color: white;
  outline: none;
  overflow: hidden;

  &:focus {
    &::before {
      content: '';
    }
  }

  &::before {
    position: absolute;
    inset: 0;
    z-index: ${zIndex.paint.focusLine};
    pointer-events: none;
    border: 1px solid ${color.primaryBg};
  }
`;
