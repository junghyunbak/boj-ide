import styled from '@emotion/styled';

export const TCDetailBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 0.5rem;

  border-top: 1px solid #ddd;

  padding: 0.5rem;
`;

export const TCDetailExampleBox = styled.div`
  display: flex;
  gap: 0.5rem;
  width: 100%;
`;

export const TCDetailExamplePre = styled.pre`
  width: 50%;
  padding: 0.5rem;
  margin: 0;

  background-color: #f7f7f9;

  border: 1px solid lightgray;

  overflow-x: scroll;

  font-size: 18px;
  font-family: 'menlo';
  line-height: 1.4;
`;

export const TCDetailTable = styled.table``;

export const TCDetailTableBody = styled.tbody``;

export const TCDetailTableRow = styled.tr``;

export const TCDetailTableData = styled.td`
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

export const TCDetailResultParagraph = styled.p<{ resultColor: string }>`
  margin: 0;
  color: ${(props) => (props.resultColor ? props.resultColor : 'black')};
  font-weight: 700;
`;

export const TCDetailPre = styled.pre`
  margin: 0;
  white-space: pre-wrap;
  font-family: open-sans;
`;
