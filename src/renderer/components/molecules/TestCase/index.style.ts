import styled from '@emotion/styled';

import { color } from '@/renderer/styles';

export const ExecuteResultContentBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.5rem;
  border-top: 1px solid #ddd;
`;

export const ExampleLayout = styled.div`
  width: 100%;
  display: flex;
  gap: 0.5rem;
`;

export const ExampleContentLayout = styled.div`
  width: calc(50% - 0.25rem);
  display: flex;
  flex-direction: column;
`;

export const ExampleContentTitleLayout = styled.div`
  display: flex;
  border-bottom: 1px dotted lightgray;
  margin-bottom: 1rem;
`;

export const ExampleContentTitleContentLayout = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: end;
  border-bottom: 2px solid ${color.primaryText};
  padding-bottom: 0.3125rem;
  margin: 0;
  margin-bottom: -2px;
`;
