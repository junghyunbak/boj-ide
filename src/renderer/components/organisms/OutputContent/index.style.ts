import styled from '@emotion/styled';

export const ExecuteResultTable = styled.table`
  width: 100%;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-collapse: collapse;
  table-layout: fixed;
  background-color: ${(props) => props.theme.colors.tableBg};
`;

export const ExecuteResultThead = styled.thead``;

export const ExecuteResultTheadRow = styled.tr``;

export const ExecuteResultHead = styled.th`
  text-align: start;
  border-left: 1px solid ${(props) => props.theme.colors.border};
  border-right: 1px solid ${(props) => props.theme.colors.border};
  padding: 0.5rem;
`;

export const ExecuteResultTbody = styled.tbody``;
