import styled from '@emotion/styled';

export const ScrollBox = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  max-height: 100dvh;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const ScrollPadding = styled.div`
  width: 100%;
  height: 90px;

  flex-shrink: 0;
`;

export const AlertBox = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.bg};
  box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.2);
  max-width: 64rem;
`;

export const AlertHeaderBox = styled.div`
  padding: 0.5rem 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.tabBg};
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
`;

export const AlertHeaderParagraph = styled.p`
  color: ${({ theme }) => theme.colors.fg};
`;

export const AlertContentBox = styled.div`
  padding: 1rem;
`;
