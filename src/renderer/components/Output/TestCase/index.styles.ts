import styled from '@emotion/styled';
import { color } from '@/styles';

export const TestCaseRow = styled.tr`
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

export const TestCaseData = styled.td`
  border-left: 1px solid #ddd;
  border-right: 1px solid #ddd;
  padding: 0.5rem;
`;

export const TestCaseStatusParagraph = styled.p<{ resultColor: string }>`
  color: ${(props) => (props.resultColor ? props.resultColor : 'black')};
  margin: 0;
  font-weight: bold;
`;

export const TestCaseElapsedParagraph = styled.p`
  margin: 0;

  span {
    color: #e74c3c;
  }
`;

export const TestCaseButton = styled.button`
  border: none;
  background: none;
  color: ${color.primaryText};
  padding: 0;

  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;
