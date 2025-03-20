import styled from '@emotion/styled';

export const ProblemHistoryItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2px 8px;
  user-select: none;
  outline: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.hover};
  }

  &:focus {
    background-color: ${({ theme }) => theme.colors.hover};
  }

  &:focus,
  &:hover {
    & * {
      opacity: 1;
    }
  }
`;

export const ProblemHistoryItemContentBox = styled.div`
  display: flex;
  gap: 0.5rem;
  flex: 1;
  overflow: hidden;
`;

export const ProblemHistoryItemContentIconImage = styled.img`
  width: 0.75rem;
`;

export const ProblemHistoryItemContentParagraph = styled.p`
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: ${({ theme }) => theme.colors.fg};
`;

export const ProblmHistoryItemCloseButtonBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 1rem;
  aspect-ratio: 1/1;
`;
