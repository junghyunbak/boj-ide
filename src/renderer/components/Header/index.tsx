import { css } from '@emotion/css';
import { color, size } from '../../../styles';
import { SaveCodeButton } from './SaveCodeButton';
import { ExecuteCodeButton } from './ExecuteCodeButton';
import { ToggleEditorMode } from './ToggleEditorMode';
import { EditorTitle } from './EditorTitle';
import { SubmitCodeButton } from './SubmitCodeButton';
import { ToggleLanguage } from './ToggleLanguage';

export function Header() {
  return (
    <div
      className={css`
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        border-bottom: 1px solid lightgray;
        height: ${size.EDITOR_HEADER_HEIGHT}px;
        min-height: ${size.EDITOR_HEADER_HEIGHT}px;
        color: ${color.text};
      `}
    >
      <div
        className={css`
          margin-left: 1rem;
        `}
      >
        <EditorTitle />
      </div>

      <div
        className={css`
          display: flex;
          gap: 0.5rem;
          margin-right: 1rem;
        `}
      >
        <ToggleLanguage />

        <ToggleEditorMode />

        <SaveCodeButton />

        <ExecuteCodeButton />

        <SubmitCodeButton />
      </div>
    </div>
  );
}
