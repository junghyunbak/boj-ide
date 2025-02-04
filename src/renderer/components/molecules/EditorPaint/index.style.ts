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

export const PaintControllerBox = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: ${zIndex.paint.fabricController};

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  width: fit-content;
  height: 100%;
  padding: 0.5rem;

  pointer-events: none;
`;

export const PaintFabricControllerBox = styled.div`
  height: calc(100% - 2rem);

  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

export const PaintFabricControllerButtonGroupBox = styled.div`
  display: flex;
  flex-direction: column;
`;

export const PaintFabricControllerButton = styled.button`
  border: 0;
  border-left: 1px solid lightgray;
  border-right: 1px solid lightgray;
  border-top: 1px solid lightgray;

  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;

  background: white;
  color: gray;
  outline: none;

  cursor: pointer;
  pointer-events: auto;

  &:last-of-type {
    border-bottom: 1px solid lightgray;
  }

  &:disabled {
    background-color: ${color.primaryBg};
    color: white;
  }
`;

export const ExpandShrinkButton = styled.button`
  border: none;

  color: gray;
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
`;
