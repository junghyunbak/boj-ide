import styled from '@emotion/styled';
import { size, color } from '@/styles';

export const HistoryBarLayout = styled.div`
  display: flex;
  overflow-x: scroll;
  background-color: #f9f9f9;
  padding-top: 0.25rem;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const HistoryBarItemLayout = styled.div`
  padding: 0;
  position: relative;
`;

export const HistoryBarItemDecoratorBox = styled.div<{ direction: 'left' | 'right' }>`
  position: absolute;
  z-index: 10;
  width: 14px;
  height: 14px;
  ${({ direction }) => (direction === 'left' ? 'left: -13px' : 'right: -13px')};
  bottom: 0;
  background-color: white;
  overflow: hidden;

  &::before {
    content: '';
    display: block;
    position: absolute;
    ${({ direction }) => (direction === 'left' ? 'left: -100%' : 'right: -100%')};
    top: -100%;
    width: 200%;
    height: 200%;
    background-color: #f9f9f9;
    border: 1px solid lightgray;
    box-sizing: border-box;
    border-radius: 8px;
  }
`;

export const HistoryBarItemContentBox = styled.div<{ isSelect: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;

  width: 100%;
  height: 100%;

  padding: 0.4375rem 0.875rem;

  background-color: ${(props) => (props.isSelect ? 'white' : 'transparent')};
  border-top-right-radius: 8px;
  border-top-left-radius: 8px;

  border-top: 1px solid ${({ isSelect }) => (isSelect ? 'lightgray' : 'transparent')};
  border-left: 1px solid ${({ isSelect }) => (isSelect ? 'lightgray' : 'transparent')};
  border-right: 1px solid ${({ isSelect }) => (isSelect ? 'lightgray' : 'transparent')};
  border-bottom: 1px solid ${({ isSelect }) => (!isSelect ? 'lightgray' : 'transparent')};
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
