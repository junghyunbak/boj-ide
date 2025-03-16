import styled from '@emotion/styled';

import { zIndex } from '@/renderer/styles';

export const EditorLayout = styled.div`
  width: 100%;
  height: 100%;

  .cm-tooltip {
    z-index: ${zIndex.editor.tooltip} !important;
  }

  .cm-gutter {
    padding: 0 10px 0 17px;
  }

  .cm-cursor {
    border-color: ${({ theme }) => theme.colors.fg};
  }

  .cm-fat-cursor {
    background: ${({ theme }) => theme.editor.cursorColor} !important;
  }

  .cm-editor:not(.cm-focused) .cm-fat-cursor {
    outline: solid 1px ${({ theme }) => theme.editor.cursorColor} !important;
    background: transparent !important;
  }

  .cm-panels {
    background-color: transparent;
    border-top: 1px solid ${({ theme }) => theme.colors.border};
  }

  .cm-vim-panel {
    padding: 5px 10px;
  }

  .cm-panels input {
    color: ${({ theme }) => theme.colors.fg} !important;
    font-family: hack;
  }
`;
