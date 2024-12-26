import styled from '@emotion/styled';
import { size } from '@/styles';

export const BrowserNavigationLayout = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;

  width: 100%;

  padding: 0.3rem 0.5rem;

  box-sizing: border-box;
  border-bottom: 1px solid lightgray;

  background-color: white;
`;

export const BrowserNavigationHistoryBox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.2rem;
`;

export const BrowserNavigationHistoryButton = styled.button<{ horizontalFlip?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 35px;

  padding: 0.5rem;

  border: none;
  border-radius: 9999px;

  transition: all ease 0.2s;

  background-color: transparent;

  transform: rotate(${(props) => (props.horizontalFlip ? 180 : 0)}deg);

  &:hover {
    background-color: #ececec;
  }

  cursor: pointer;

  svg {
    width: 100%;
    color: gray;
  }
`;

export const BrowserNavigationBookmarkBox = styled.div`
  display: flex;
`;

export const BrowserNavigationBookmarkButton = styled.button`
  border: none;

  padding: 0.4rem 0.8rem;

  background: none;

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }

  cursor: pointer;
`;
