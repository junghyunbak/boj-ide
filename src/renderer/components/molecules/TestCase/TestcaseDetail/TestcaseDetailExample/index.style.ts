import styled from '@emotion/styled';

export const TestcaseDetailExampleLayout = styled.div`
  width: calc(50% - 0.25rem);
  display: flex;
  flex-direction: column;
`;

export const TestcaseDetailExampleTitleLayout = styled.div`
  display: flex;
  border-bottom: 1px dotted ${(props) => props.theme.colors.border};
  margin-bottom: 1rem;
`;

export const TestcaseDetailExampleTitleBox = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: end;
  border-bottom: 2px solid ${(props) => props.theme.colors.primarybg};
  padding-bottom: 0.3125rem;
  margin: 0;
  margin-bottom: -2px;
`;

export const TestcaseDetailExampleTitleParagraph = styled.p`
  font-size: 1.25rem;
`;
