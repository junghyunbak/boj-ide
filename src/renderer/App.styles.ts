import styled from '@emotion/styled';

export const AppLayout = styled.div`
  position: fixed;
  inset: 0;

  display: flex;
  flex-direction: column;
`;

export const AppContentBox = styled.div`
  flex: 1;
  overflow: hidden;
`;

export const EditorAndOutputBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;
