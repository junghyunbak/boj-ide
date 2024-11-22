import { css } from '@emotion/css';
import { useShallow } from 'zustand/shallow';
import { useStore } from '../../../store';
import { ToggleEditorModeButton } from './ToggleEditorModeButton';

export function ToggleEditorMode() {
  const [mode, setMode] = useStore(useShallow((s) => [s.mode, s.setMode]));

  const handleModeButtonClick = (nextMode: EditorMode) => () => {
    setMode(nextMode);
  };

  return (
    <div
      className={css`
        display: flex;
        border: 1px solid lightgray;
        overflow: hidden;
      `}
    >
      <ToggleEditorModeButton onClick={handleModeButtonClick('normal')} isSelect={mode === 'normal'}>
        normal
      </ToggleEditorModeButton>

      <ToggleEditorModeButton onClick={handleModeButtonClick('vim')} isSelect={mode === 'vim'}>
        vim
      </ToggleEditorModeButton>
    </div>
  );
}
