import { useCallback } from 'react';

import { css } from '@emotion/react';

import { AngleButton } from '@/renderer/components/atoms/buttons/AngleButton';

import { useEditor, useModifyEditor, useModifySetting } from '@/renderer/hooks';
import {
  SettingCloseButtonBox,
  SettingGroupBox,
  SettingGroupControleBox,
  SettingGroupLabelBox,
  SettingLayout,
  SettingTitleBox,
  SettingTitleParagraph,
} from './index.style';

export function EditorSettings() {
  const { editorMode, editorFontSize, editorIndentSpace, EDITOR_INDENT_SPACES, EDITOR_MODES } = useEditor();

  const { updateIsSetting } = useModifySetting();
  const { updateEditorMode, updateEditorFontSize, updateEditorIndentSpace } = useModifyEditor();

  const handleBackButtonClick = useCallback(() => {
    updateIsSetting(false);
  }, [updateIsSetting]);

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
    <SettingLayout>
      <SettingCloseButtonBox>
        <AngleButton onClick={handleBackButtonClick} />
      </SettingCloseButtonBox>

      <SettingTitleBox>
        <SettingTitleParagraph>설정</SettingTitleParagraph>
      </SettingTitleBox>

      <SettingGroupBox>
        <SettingGroupLabelBox>에디터 모드</SettingGroupLabelBox>

        <SettingGroupControleBox>
          <div>
            <fieldset
              css={css`
                border: 0;
                display: flex;
                flex-direction: column;
                padding: 0;
              `}
            >
              {EDITOR_MODES.map((mode, i) => {
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
        </SettingGroupControleBox>
      </SettingGroupBox>

      <SettingGroupBox>
        <SettingGroupLabelBox>에디터 폰트 크기</SettingGroupLabelBox>
        <SettingGroupControleBox>
          <select value={editorFontSize} onChange={handleSelectOptionChange}>
            {[8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((fontSize, i) => {
              return <option key={i}>{fontSize}</option>;
            })}
          </select>
        </SettingGroupControleBox>
      </SettingGroupBox>

      <SettingGroupBox>
        <SettingGroupLabelBox>들여쓰기 공백 크기</SettingGroupLabelBox>
        <SettingGroupControleBox>
          <select value={editorIndentSpace} onChange={handleIndentSpaceOptionChange}>
            {EDITOR_INDENT_SPACES.map((indentSpace, i) => {
              return <option key={i}>{indentSpace}</option>;
            })}
          </select>
        </SettingGroupControleBox>
      </SettingGroupBox>
    </SettingLayout>
  );
}
