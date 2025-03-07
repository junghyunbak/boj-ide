import { css, type Theme } from '@emotion/react';

export const globalStyle = (theme: Theme) => css`
  html {
    font-size: 14px;
  }

  #root * {
    box-sizing: border-box;
  }

  * {
    &::-webkit-scrollbar {
      width: 7px;
      height: 7px;
    }

    &::-webkit-scrollbar-thumb {
      background: ${theme.colors.scrollbar};
      cursor: auto;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-corner {
      background: transparent;
    }
  }

  body {
    background: ${theme.colors.bg};
    color: ${theme.colors.fg};
  }

  p,
  pre {
    margin: 0;
  }

  body,
  button {
    font-family: 'open-sans';
  }
`;
