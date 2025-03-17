import { type Themes } from '@/renderer/store/slices/theme';

import { Theme } from '@emotion/react';

import { tags as t } from '@lezer/highlight';
import { CreateThemeOptions } from '@uiw/codemirror-themes';
import { defaultSettingsEclipse, eclipseLightStyle } from '@uiw/codemirror-theme-eclipse';

import { adjustTransparency } from '../utils/color';

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
      tableFgLabel: string;

      tabBg: string;

      scrollbar: string;
      scrollbarHover: string;
      scrollbarActive: string;

      buttonFg: string;

      disabledFg: string;

      hover: string;
      active: string;
      accent: string;
      code: string;
      border: string;
    };
    editor: {
      settings: CreateThemeOptions['settings'];
      styles: CreateThemeOptions['styles'];
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

      disabledFg: '#ccc',

      tableBg: '#fff',
      tableBgAccent: '#f9f9f9',
      tableFgLabel: '#808080',

      tabBg: '#f9f9f9',

      scrollbar: '#00000033',
      scrollbarHover: '#0000004c',
      scrollbarActive: '#0000004c',

      hover: '#f5f5f5',
      accent: '#808080',
      active: '#eee',
      border: '#ddd',
      code: '#f7f7f9',
    },
    editor: {
      settings: {
        ...defaultSettingsEclipse,

        caret: undefined,

        gutterForeground: '#808080',
        gutterBackground: '#f9f9f9',
        gutterBorder: '#ddd',
      },
      styles: eclipseLightStyle,
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
      tableFgLabel: '#44576c',

      scrollbar: '#37485D',
      scrollbarHover: '#37485D',
      scrollbarActive: '#37485D',

      tabBg: '#0C151C',

      buttonFg: '#fff',

      disabledFg: '#808080',

      hover: '#172334',
      accent: '#B2C0CC',
      active: '#202B3D',
      border: '#172334',
      code: '#202B3D',
    },
    editor: {
      settings: {
        gutterForeground: '#44576c',
        gutterBackground: '#263747',
        gutterBorder: 'transparent',

        selection: '#44576c',
        selectionMatch: '#44576c',

        caret: '#7e7',

        lineHighlight: adjustTransparency('#202B3D', '#263747', 0.2),
      },
      /**
       * TODO: 높은 스코프 변수명 하이라이트
       *
       * Codemirror 라이브러리 코어 문제
       * .cm-s-tomorrow-night-bright span.cm-variable-2 { color: #7aa6da }
       */
      styles: [
        {
          tag: t.comment,
          color: '#d27b53',
        },
        {
          tag: [t.atom, t.number],
          color: '#a16a94',
        },
        {
          tag: [t.propertyName, t.attributeName],
          color: '#99cc99',
        },
        {
          tag: t.keyword,
          color: '#C38FE5',
        },
        {
          tag: t.string,
          color: '#e7c547',
        },
        {
          tag: t.variableName,
          color: '#4CAF50',
        },
        {
          tag: t.bracket,
          color: '#eaeaea',
        },
        {
          tag: t.tagName,
          color: '#d54e53',
        },
        {
          tag: t.link,
          color: '#a16a94',
        },
        {
          tag: t.definition(t.variableName),
          color: '#FFEB3B',
        },
      ],
    },
  },
};
