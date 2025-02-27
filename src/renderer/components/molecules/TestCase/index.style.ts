import styled from '@emotion/styled';

export const TestcaseRow = styled.tr`
  border-top: 1px solid ${(props) => props.theme.colors.border};

  &:nth-of-type(2n) {
    border-top: none;

    & > td {
      padding: 0;
      border: none;
    }
  }

  &:nth-of-type(4n - 3) {
    background-color: ${(props) => props.theme.colors.tableBgAccent};
  }
`;

export const TestcaseData = styled.td`
  border-left: 1px solid ${(props) => props.theme.colors.border};
  border-right: 1px solid ${(props) => props.theme.colors.border};
  padding: 0.5rem;
`;
