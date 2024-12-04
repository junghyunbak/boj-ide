import styled from '@emotion/styled';
import { size, color } from '@/styles';

export const HistoryBarLayout = styled.div`
  border-bottom: 1px solid lightgray;
  display: flex;
  overflow-x: scroll;
  min-height: ${size.HISTORY_BAR_HEIGHT}px;
  height: ${size.HISTORY_BAR_HEIGHT}px;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const HistoryBarItemLayout = styled.div`
  border-right: 1px solid lightgray;
  padding: 0;
`;

export const HistoryBarItemContentBox = styled.div<{ isSelect: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;

  width: 100%;
  height: 100%;

  padding: 0 0.7rem;

  border-bottom: 2px solid ${(props) => (props.isSelect ? '#428bca' : 'transparent')};
`;

export const HistoryBarItemContentParagraph = styled.p`
  user-select: none;
  margin: 0;
  white-space: nowrap;
  font-size: 0.8125rem;
  color: ${color.text};
`;

export const HistoryBarItemCloseButton = styled.button`
  border: none;
  border-radius: 9999px;

  width: 15px;
  height: 15px;
  padding: 1px;

  background-color: transparent;

  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background-color: lightgray;
    cursor: pointer;
  }

  svg {
    width: 100%;
    height: 100%;
    color: ${color.text};
  }
`;
