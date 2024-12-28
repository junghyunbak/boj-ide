import styled from '@emotion/styled';

export const ProcessResultTable = styled.table`
  width: fit-content;
`;
export const ProcessResultThead = styled.thead``;
export const ProcessResultHead = styled.th``;
export const ProcessResultTbody = styled.tbody``;
export const ProcessResultRow = styled.tr``;
export const ProcessResultData = styled.td`
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
