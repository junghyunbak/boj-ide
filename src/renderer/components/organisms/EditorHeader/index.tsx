import { css } from '@emotion/react';
import { SaveCodeButton } from '@/renderer/components/molecules/SaveCodeButton';
import { AICodeCreateButton } from '@/renderer/components/molecules/AICodeCreateButton';
import { ToggleLanguage } from '@/renderer/components/molecules/ToggleLanguage';
import { SettingToggleButton } from '@/renderer/components/molecules/SettingToggleButton';

export function EditorHeader() {
  return (
    <div
      css={css`
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.25rem 0.5rem;
      `}
    >
      <ToggleLanguage />
      <div
        css={css`
          display: flex;
          gap: 8px;
        `}
      >
        <SettingToggleButton />
        <AICodeCreateButton />
        <SaveCodeButton />
      </div>
    </div>
  );
}
