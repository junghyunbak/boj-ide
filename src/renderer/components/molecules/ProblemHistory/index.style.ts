import styled from '@emotion/styled';

import { ReactComponent as History } from '@/renderer/assets/svgs/history.svg';

export const ProblemHistoryLayout = styled.div`
  position: absolute;
  width: 30dvw;
  max-width: 500px;
  display: flex;
  justify-content: center;
`;

export const ProblemHistoryButton = styled.button`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.code};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  padding: 2px 0;
  outline: none;
  color: ${({ theme }) => theme.colors.fg};
  gap: 0.25rem;
  user-select: none;
  cursor: pointer;
`;

export const ProblemHistoryButtonIcon = styled(History)`
  width: 0.75rem;
  color: ${({ theme }) => theme.colors.fg};
`;

export const ProblemHistoryButtonParagraph = styled.p``;

export const ProblemHistoryModalLayout = styled.div`
  width: 100%;
  min-width: 500px;
  height: 100%;
  user-select: none;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const ProblemHistoryModalInputBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 4px;
`;

export const ProblemHistoryModalInput = styled.input`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.code};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  padding: 3px 4px;
  outline: none;
  color: ${({ theme }) => theme.colors.fg};
`;

export const ProblemHistoryModalListBox = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
`;

export const ProblemHistoryModalList = styled.ul`
  margin: 0;
  padding: 0 4px;
  display: flex;
  flex-direction: column;
`;

export const ProblemHistoryModalPlaceholder = styled.div`
  padding: 0 4px;
`;
