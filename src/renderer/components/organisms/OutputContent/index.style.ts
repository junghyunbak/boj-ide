import styled from '@emotion/styled';

export const ExecuteResultTable = styled.table`
  width: 100%;
  border: 1px solid #ddd;
  border-collapse: collapse;
  table-layout: fixed;
`;

export const ExecuteResultThead = styled.thead``;

export const ExecuteResultTheadRow = styled.tr``;

export const ExecuteResultHead = styled.th`
  text-align: start;
  border-left: 1px solid #ddd;
  border-right: 1px solid #ddd;
  padding: 0.5rem;
`;

export const ExecuteResultTbody = styled.tbody``;

export const ExecuteResultRow = styled.tr`
  border-top: 1px solid #ddd;

  &:nth-of-type(2n) {
    border-top: none;

    & > td {
      padding: 0;
      border: none;
    }
  }

  &:nth-of-type(4n - 3) {
    background-color: #f9f9f9;
  }
`;

export const ExecuteResultData = styled.td`
  border-left: 1px solid #ddd;
  border-right: 1px solid #ddd;
  padding: 0.5rem;
`;
