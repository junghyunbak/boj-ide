import { type Themes } from '@/renderer/store/slices/theme';

import { css, Theme } from '@emotion/react';

import { adjustTransparency } from '@/renderer/utils';

export const judgeColors = {
  correct: '#009874',
  wrong: '#dd4124',
  error: '#5f4b8b',
  over: '#fa7268',
  compileError: '#0f4c81',
  judging: '#e67e22',
};

declare module '@emotion/react' {
  export interface Theme {
    common: {
      colors: {
        judge: typeof judgeColors;
      };
    };
    theme: 'dark' | 'light';
    colors: {
      primarybg: string;
      primaryfg: string;

      bg: string;
      fg: string;

      tableBg: string;
      tableBgAccent: string;

      tabBg: string;

      scrollbar: string;
      scrollbarHover: string;
      scrollbarActive: string;

      buttonFg: string;

      disabledFg: string;

      active: string;
      accent: string;
      code: string;
      border: string;
    };
    editor: {
      colors: {
        cursor: string;

        gutterFg: string;
        gutterBg: string;
        gutterBorder: string;

        lineHightlight: string;

        selection: string;

        keyword: string;
        atom: string;
        number: string;
        property: string;
        attribute: string;
        comment: string;
        string: string;
        variable: string;
        bracket: string;
        tag: string;
        link: string;
        invalid: string;
      };
    };
  }
}

export const themes: Record<Themes, Theme> = {
  baekjoon: {
    theme: 'light',
    common: {
      colors: {
        judge: judgeColors,
      },
    },
    colors: {
      primarybg: '#428bca',
      primaryfg: '#0076C0',

      bg: '#fff',
      fg: '#333',

      buttonFg: '#fff',

      disabledFg: '#ddd',

      tableBg: '#fff',
      tableBgAccent: '#f9f9f9',

      tabBg: '#f9f9f9',

      scrollbar: '#00000033',
      scrollbarHover: '#0000004c',
      scrollbarActive: '#0000004c',

      accent: '#808080',
      active: '#f5f5f5',
      border: '#ddd',
      code: '#f7f7f9',
    },
    editor: {
      colors: {
        cursor: '#7e7',

        gutterFg: '#ddd',
        gutterBg: 'transparent',
        gutterBorder: 'transparent',

        lineHightlight: '#e8f2ff80',

        selection: '#d9d9d9',

        keyword: '#708',
        atom: '#219',
        number: '#164',
        property: '#00f',
        attribute: '#00c',
        comment: '#a50',
        string: '#a11',
        variable: '#05a',
        bracket: '#997',
        tag: '#170',
        link: '#00c',
        invalid: '#f00',
      },
    },
  },
  programmers: {
    theme: 'dark',
    common: {
      colors: {
        judge: judgeColors,
      },
    },
    colors: {
      primarybg: '#44576c',
      primaryfg: '#fff',

      bg: '#263747',
      fg: '#B2C0CC',

      tableBg: '#202B3D',
      tableBgAccent: '#202B3D',

      scrollbar: '#37485D',
      scrollbarHover: '#37485D',
      scrollbarActive: '#37485D',

      tabBg: '#0C151C',

      buttonFg: '#fff',

      disabledFg: '#808080',

      accent: '#B2C0CC',
      active: '#202B3D',
      border: '#172334',
      code: '#202B3D',
    },
    editor: {
      colors: {
        cursor: '#7e7',

        gutterFg: '#44576c',
        gutterBg: 'transparent',
        gutterBorder: 'transparent',

        lineHightlight: adjustTransparency('#202B3D', '#263747', 0.2),

        selection: '#44576c',

        keyword: '#C38FE5',
        atom: '#a16a94',
        number: '#a16a94',
        property: '#99cc99',
        attribute: '#99cc99',
        comment: '#d27b53',
        string: '#e7c547',
        variable: '#4CAF50',
        bracket: '#eaeaea',
        tag: '#d54e53',
        link: '#a16a94',
        invalid: '#6A6A6A',
      },
    },
  },
};

export const globalStyle = (theme: Theme) => css`
  html {
    font-size: 14px;
  }

  #root * {
    box-sizing: border-box;
  }

  body {
    background: ${theme.colors.bg};
    color: ${theme.colors.fg};
  }

  p {
    margin: 0;
  }

  body,
  button {
    font-family: 'open-sans';
  }
`;
