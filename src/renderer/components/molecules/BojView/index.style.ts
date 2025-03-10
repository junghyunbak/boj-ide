import styled from '@emotion/styled';

export const BojViewLayout = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
`;

export const BojViewLoadingLayout = styled.div`
  position: absolute;
  inset: 0;
`;

export const BojViewLodingContentBox = styled.div`
  width: 100%;
  height: 100%;

  background-color: ${({ theme }) => theme.colors.bg};

  display: flex;
  justify-content: center;
  align-items: center;
`;

export const BojViewLoadingContentParagraph = styled.p`
  font-size: 2rem;
`;

export const BojViewLoadingCloseButton = styled.button`
  position: absolute;
  right: 0;
  top: 0;

  margin: 1rem;
  padding: 0;

  cursor: pointer;

  background: none;
  border: none;

  svg {
    color: ${({ theme }) => theme.colors.fg};
    width: 1rem;
  }
`;
