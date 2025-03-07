import { css, type Theme } from '@emotion/react';

export const createWebviewStyle = (theme: Theme) => {
  return css`
    /* background */
    html,
    .wrapper {
      background: ${theme.colors.bg} !important;
    }

    /* text */

    .copy-button,
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      color: ${theme.colors.primaryfg} !important;
    }

    body,
    li,
    a,
    p {
      color: ${theme.colors.fg} !important;
    }

    /* border */
    .navbar-collapse,
    .nav,
    .nav a,
    .nav h3,
    .headline h2,
    .headline h3,
    .headline h4 {
      border-color: ${theme.colors.primarybg} !important;
    }

    .navbar-nav a {
      border-color: ${theme.colors.border} !important;
    }

    .mega-menu-content * {
      border-left-color: ${theme.colors.border} !important;
    }

    blockquote,
    .header,
    .page-header,
    .table-responsive,
    .table,
    .table *,
    .headline {
      border-color: ${theme.colors.border} !important;
    }

    blockquote:hover {
      border-color: ${theme.colors.primarybg} !important;
    }

    /* anchor */
    .active a:not(.mega-menu-content a) {
      background-color: ${theme.colors.primarybg} !important;
    }

    .nav a:hover,
    .dropdown-menu a:hover,
    .dropdown-menu a:focus {
      background-color: ${theme.colors.active} !important;
    }

    .mega-menu-content a:hover {
      background-color: ${theme.colors.active} !important;
    }

    /* code block */
    pre,
    code,
    .sampledata {
      background-color: ${theme.colors.code} !important;
      border: ${theme.colors.border} !important;
      color: ${theme.colors.fg} !important;
    }

    /* list */
    .btn-default,
    .dropdown-menu {
      color: ${theme.colors.fg} !important;
      background-color: ${theme.colors.bg} !important;
      border-color: ${theme.colors.border} !important;
    }

    /* scrollbar */
    *::-webkit-scrollbar {
      width: 7px;
      height: 7px;
    }

    *::-webkit-scrollbar-thumb {
      background: ${theme.colors.scrollbar};
    }

    *::-webkit-scrollbar-track {
      background: ${theme.colors.bg};
    }

    *::-webkit-scrollbar-corner {
      background: ${theme.colors.bg};
    }
  `.styles;
};
