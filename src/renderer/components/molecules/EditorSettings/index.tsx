import { css } from '@emotion/react';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { AngleButton } from '@/renderer/components/atoms/buttons/AngleButton';
import { useCallback } from 'react';
import { useEditor, useModifyEditor } from '@/renderer/hooks';

const EditorMode: EditorMode[] = ['normal', 'vim'];
const EditorIndentSpace: IndentSpace[] = [2, 4];

export function EditorSettings() {
  const [setIsSetting] = useStore(useShallow((s) => [s.setIsSetting]));

  const { editorMode, editorFontSize, editorIndentSpace } = useEditor();
  const { updateEditorMode, updateEditorFontSize, updateEditorIndentSpace } = useModifyEditor();

  const handleBackButtonClick = useCallback(() => {
    setIsSetting(false);
  }, [setIsSetting]);

  const handleEditorModeRatioButtonClick = useCallback(
    (mode: EditorMode) => {
      return () => {
        updateEditorMode(mode);
      };
    },
    [updateEditorMode],
  );

  const handleSelectOptionChange = useCallback<React.ChangeEventHandler<HTMLSelectElement>>(
    (e) => {
      const fontSize = +e.target.value;

      if (!Number.isNaN(fontSize)) {
        updateEditorFontSize(fontSize);
      }
    },
    [updateEditorFontSize],
  );

  const handleIndentSpaceOptionChange = useCallback<React.ChangeEventHandler<HTMLSelectElement>>(
    (e) => {
      const indentSpace = +e.target.value;

      if (!Number.isNaN(indentSpace) && (indentSpace === 2 || indentSpace === 4)) {
        updateEditorIndentSpace(indentSpace);
      }
    },
    [updateEditorIndentSpace],
  );

  return (
    <div
      css={css`
        width: 100%;
        height: 100%;
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        position: relative;

        > div {
          display: flex;
          gap: 1rem;

          h5 {
            width: 16%;
            text-align: right;
            margin: 0;
          }
        }
      `}
    >
      <div
        css={css`
          right: 1rem;
          top: 1rem;
          position: absolute;
        `}
      >
        <AngleButton onClick={handleBackButtonClick} />
      </div>

      <div
        css={(theme) => css`
          border-bottom: 1px solid ${theme.colors.border};
          margin: 1rem 0;
        `}
      >
        <p
          css={css`
            font-size: 1.3rem;
          `}
        >
          설정
        </p>
      </div>

      <div>
        <h5>에디터 모드</h5>
        <fieldset
          css={css`
            border: 0;
            display: flex;
            flex-direction: column;
            padding: 0;
          `}
        >
          {EditorMode.map((mode, i) => {
            return (
              <label key={i}>
                <input
                  type="radio"
                  name={mode}
                  value={mode}
                  checked={editorMode === mode}
                  onChange={handleEditorModeRatioButtonClick(mode)}
                />
                {mode}
              </label>
            );
          })}
        </fieldset>
      </div>

      <div>
        <h5>에디터 폰트 크기</h5>
        <select value={editorFontSize} onChange={handleSelectOptionChange}>
          {[8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((fontSize, i) => {
            return <option key={i}>{fontSize}</option>;
          })}
        </select>
      </div>

      <div>
        <h5>들여쓰기 공백 크기</h5>
        <select value={editorIndentSpace} onChange={handleIndentSpaceOptionChange}>
          {EditorIndentSpace.map((indentSpace, i) => {
            return <option key={i}>{indentSpace}</option>;
          })}
        </select>
      </div>
    </div>
  );
}
