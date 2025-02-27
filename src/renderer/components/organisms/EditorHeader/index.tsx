import { css } from '@emotion/react';

import { SaveCodeButton } from '@/renderer/components/molecules/SaveCodeButton';
import { AICodeCreateButton } from '@/renderer/components/molecules/AICodeCreateButton';
import { ToggleLanguage } from '@/renderer/components/molecules/ToggleLanguage';
import { ToggleSettingButton } from '@/renderer/components/molecules/ToggleSettingButton';
import { TogglePaintButton } from '@/renderer/components/molecules/TogglePaintButton';
import { SetDefaultCodeButton } from '@/renderer/components/molecules/SetDefaultCodeButton';

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
          gap: 0.5rem;
        `}
      >
        <div
          css={css`
            display: flex;
            gap: 0.2rem;
          `}
        >
          <TogglePaintButton />
          <ToggleSettingButton />
        </div>
        <SetDefaultCodeButton />
        <AICodeCreateButton />
        <SaveCodeButton />
      </div>
    </div>
  );
}
