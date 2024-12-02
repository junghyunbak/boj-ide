import styled from '@emotion/styled';
import { useStore } from '@/renderer/store';

export const HLLayout = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

export const HLLeftBox = styled.div`
  width: ${useStore.getState().leftRatio}%;
  height: 100%;
`;

export const HLResizerBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 15px;
  height: 100%;

  background-color: white;

  border-left: 1px solid lightgray;
  border-right: 1px solid lightgray;

  &:hover {
    cursor: col-resize;
  }

  &::before {
    content: '';
    display: block;
    height: 50px;
    border-left: 5px dotted lightgray;
  }
`;

export const HLRightBox = styled.div`
  flex: 1;
  overflow: hidden;
`;
