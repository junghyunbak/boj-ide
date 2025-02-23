import styled from '@emotion/styled';

import { css } from '@emotion/react';

type TabState = {
  isSelect?: boolean;
  polyfill?: boolean;
};

export const TabLayout = styled.div<TabState>`
  position: relative;

  ${({ isSelect }) =>
    isSelect
      ? css`
          background-color: white;
        `
      : css`
          background-color: #f9f9f9;
        `};

  ${({ isSelect, polyfill }) =>
    !polyfill && !isSelect
      ? css`
          &:hover {
            background-color: #fdfdfd;
          }
        `
      : ''}

  ${({ polyfill }) =>
    polyfill
      ? css`
          flex: 1;
          cursor: auto;
          background-color: transparent;
        `
      : css`
          cursor: pointer;
        `}
`;
