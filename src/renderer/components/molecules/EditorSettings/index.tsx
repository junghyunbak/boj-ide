import { css } from '@emotion/react';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { AngleButton } from '@/renderer/components/atoms/buttons/AngleButton';
import { Text } from '@/renderer/components/atoms/paragraphs/Text';

const EditorMode: EditorMode[] = ['normal', 'vim'];
const EditorIndentSpace: IndentSpace[] = [2, 4];

export function EditorSettings() {
  const [editorMode, setEditorMode] = useStore(useShallow((s) => [s.mode, s.setMode]));
  const [editorfontSize, setEditorFontSize] = useStore(useShallow((s) => [s.fontSize, s.setFontSize]));
  const [editorIndentSpace, setEditorIndentSpace] = useStore(useShallow((s) => [s.indentSpace, s.setIndentSpace]));
  const [setIsSetting] = useStore(useShallow((s) => [s.setIsSetting]));

  const handleBackButtonClick = () => {
    setIsSetting(false);
  };

  const handleEditorModeRatioButtonClick = (mode: EditorMode) => () => {
    setEditorMode(mode);
  };

  const handleSelectOptionChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    const fontSize = +e.target.value;

    if (!Number.isNaN(fontSize)) {
      setEditorFontSize(fontSize);
    }
  };

  const handleIndentSpaceOptionChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    const indentSpace = +e.target.value;

    if (!Number.isNaN(indentSpace) && (indentSpace === 2 || indentSpace === 4)) {
      setEditorIndentSpace(indentSpace);
    }
  };

  return (
    <div
      css={css`
        width: 100%;
        height: 100%;
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        color: #333;
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
        css={css`
          border-bottom: 1px solid #e5e5e5;
          margin: 1rem 0;
        `}
      >
        <Text fontSize="1.3125rem">설정</Text>
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
        <select value={editorfontSize} onChange={handleSelectOptionChange}>
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
