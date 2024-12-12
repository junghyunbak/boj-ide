import styled from '@emotion/styled';
import { useStore } from '@/renderer/store';

export const VLLayout = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

export const VLTopBox = styled.div`
  width: 100%;
  height: ${useStore.getState().topRatio}%;
`;

export const VLResizerBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  height: 15px;
  width: 100%;

  background: white;

  border-top: 1px solid lightgray;
  border-bottom: 1px solid lightgray;

  &:hover {
    cursor: row-resize;
  }

  &::before {
    content: '';
    display: block;
    border-top: 5px dotted lightgray;
    width: 50px;
  }
`;

export const VLBottomBox = styled.div`
  flex: 1;
  overflow: hidden;
`;
