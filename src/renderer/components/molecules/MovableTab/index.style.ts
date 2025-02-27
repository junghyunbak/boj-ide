import styled from '@emotion/styled';

import { css } from '@emotion/react';

type TabState = {
  isSelect?: boolean;
  polyfill?: boolean;
};

export const TabLayout = styled.div<TabState>`
  position: relative;

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
