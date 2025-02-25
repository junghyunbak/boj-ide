import styled from '@emotion/styled';

export const TestcaseRow = styled.tr`
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

export const TestcaseData = styled.td`
  border-left: 1px solid #ddd;
  border-right: 1px solid #ddd;
  padding: 0.5rem;
`;
