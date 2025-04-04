import styled from '@emotion/styled';

export const PaintControllerBox = styled.div`
  width: fit-content;
  height: 100%;

  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 1rem;

  background-color: ${(props) => props.theme.colors.code};

  border-right: 1px solid ${(props) => props.theme.colors.border};
`;

export const PaintFabricControllerButtonGroupBox = styled.div`
  display: flex;
  flex-direction: column;
`;

export const PaintFabricControllerButton = styled.button`
  border: 0;

  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;

  background: transparent;
  color: ${(props) => props.theme.colors.fg};
  outline: none;

  cursor: pointer;

  &:disabled {
    background-color: ${(props) => props.theme.colors.border};
  }
`;
