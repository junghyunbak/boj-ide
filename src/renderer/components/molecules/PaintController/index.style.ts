import { css } from '@emotion/react';
import styled from '@emotion/styled';

export const PaintControllerBox = styled.div`
  width: fit-content;
  height: 100%;

  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  row-gap: 1rem;
  flex-shrink: 0;

  background-color: ${(props) => props.theme.colors.code};

  border-right: 1px solid ${(props) => props.theme.colors.border};
`;

export const PaintFabricControllerButtonGroupBox = styled.div`
  display: flex;
  flex-direction: column;
`;

export const PaintFabricControllerButton = styled.button<{ isSelect?: boolean }>`
  border: 0;

  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;

  background: transparent;
  color: ${(props) => props.theme.colors.fg};
  outline: none;

  cursor: pointer;

  ${({ isSelect, theme }) =>
    isSelect
      ? css`
          background-color: ${theme.colors.border};
        `
      : css``}
`;
