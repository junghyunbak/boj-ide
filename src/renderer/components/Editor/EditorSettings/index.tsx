import { css } from '@emotion/react';
import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';

const EditorMode: EditorMode[] = ['normal', 'vim'];

export function EditorSettings() {
  const [editorMode, setEditorMode] = useStore(useShallow((s) => [s.mode, s.setMode]));
  const [editorfontSize, setEditorFontSize] = useStore(useShallow((s) => [s.fontSize, s.setFontSize]));
  const [setIsSetting] = useStore(useShallow((s) => [s.setIsSetting]));

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

        fieldset {
          border: 0;
          display: flex;
          flex-direction: column;
          padding: 0;
        }

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
        <button
          type="button"
          css={css`
            border: 0;
            background: none;
            cursor: pointer;
            color: #333;
          `}
          onClick={() => {
            setIsSetting(false);
          }}
        >
          <FontAwesomeIcon icon={faAngleRight} />
        </button>
      </div>
      <p
        css={css`
          font-size: 1.3125rem;
          border-bottom: 1px solid #e5e5e5;
        `}
      >
        설정
      </p>
      <div>
        <h5>에디터 모드</h5>
        <fieldset>
          {EditorMode.map((mode, i) => {
            return (
              <label key={i}>
                <input
                  type="radio"
                  name={mode}
                  value={mode}
                  checked={editorMode === mode}
                  onChange={() => {
                    setEditorMode(mode);
                  }}
                />
                <span>{mode}</span>
              </label>
            );
          })}
        </fieldset>
      </div>
      <div>
        <h5>에디터 폰트 크기</h5>
        <select
          value={editorfontSize}
          onChange={(e) => {
            const fontSize = +e.target.value;

            if (!Number.isNaN(fontSize)) {
              setEditorFontSize(fontSize);
            }
          }}
        >
          {[8, 9, 10, 11, 12, 13, 14, 15, 16].map((fontSize, i) => {
            return <option key={i}>{fontSize}</option>;
          })}
        </select>
      </div>
    </div>
  );
}
