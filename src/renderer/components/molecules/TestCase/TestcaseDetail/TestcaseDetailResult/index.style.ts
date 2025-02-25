import styled from '@emotion/styled';

export const TestcaseDetailResultTable = styled.table`
  width: fit-content;
`;

export const TestcaseDetailResultTableBody = styled.tbody``;

export const TestcaseDetailResultTableRow = styled.tr``;

export const TestcaseDetailResultTableData = styled.td`
  word-break: break-all;

  &:first-of-type {
    white-space: nowrap;
    text-align: right;
    vertical-align: top;
    color: gray;

    &::after {
      content: '>';
      padding: 0 0.5rem;
    }
  }
`;
