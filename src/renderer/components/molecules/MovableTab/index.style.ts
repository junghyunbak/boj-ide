import styled from '@emotion/styled';

import { css } from '@emotion/react';

type TabState = {
  polyfill?: boolean;
};

export const TabLayout = styled.div<TabState>`
  position: relative;
  user-select: none;

  ${({ polyfill = false }) =>
    polyfill
      ? css`
          flex: 1;
          background-color: transparent;
          cursor: auto;
        `
      : css`
          cursor: pointer;
        `}
`;
