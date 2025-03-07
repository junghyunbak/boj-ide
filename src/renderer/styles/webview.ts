import { css, type Theme } from '@emotion/react';

export const createWebviewStyle = (theme: Theme) => {
  return css`
    html,
    .wrapper {
      background: ${theme.colors.bg} !important;
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      color: ${theme.colors.primaryfg} !important;
    }

    .navbar-collapse,
    .nav,
    .nav a,
    .nav h3,
    .headline h2,
    .headline h3,
    .headline h4 {
      border-color: ${theme.colors.primarybg} !important;
    }

    body,
    li,
    a,
    p {
      color: ${theme.colors.fg} !important;
    }

    .active a:not(.mega-menu-content a) {
      background-color: ${theme.colors.primarybg} !important;
    }

    .header,
    .page-header,
    .table-responsive,
    .table,
    .table *,
    .headline {
      border-color: ${theme.colors.border} !important;
    }

    pre,
    code,
    .sampledata {
      background-color: ${theme.colors.code} !important;
      border: ${theme.colors.border} !important;
      color: ${theme.colors.fg} !important;
    }

    .btn-default,
    .dropdown-menu {
      color: ${theme.colors.fg} !important;
      background-color: ${theme.colors.bg} !important;
      border-color: ${theme.colors.border} !important;
    }

    .nav a:hover,
    .dropdown-menu a:hover,
    .dropdown-menu a:focus {
      background-color: ${theme.colors.active} !important;
    }

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
