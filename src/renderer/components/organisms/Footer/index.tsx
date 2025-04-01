import { css } from '@emotion/react';

import { ReleasesButton } from '@/renderer/components/molecules/ReleasesButton';
import { StorageButton } from '@/renderer/components/molecules/StorageButton';
import { EditorTabSize } from '@/renderer/components/molecules/EditorTabSize';
import { VimModeText } from '@/renderer/components/molecules/VimModeText';
import { AppUpdaterInfo } from '@/renderer/components/molecules/AppUpdaterInfo';
import { TourButton } from '@/renderer/components/molecules/TourButton';
import { GithubButton } from '@/renderer/components/molecules/GithubButton';
import { JudgeInfoButton } from '@/renderer/components/molecules/JudgeInfoButton';

export function Footer() {
  return (
    <div
      css={(theme) => css`
        display: flex;
        border-top: 1px solid ${theme.colors.border};
      `}
    >
      <GithubButton />

      <div
        css={css`
          flex: 1;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 0.5rem;
          overflow: hidden;
        `}
      >
        <div
          css={css`
            display: flex;
          `}
        >
          <StorageButton />
          <TourButton />
          <JudgeInfoButton />
          <VimModeText />
        </div>

        <div
          css={css`
            display: flex;
          `}
        >
          <AppUpdaterInfo />
          <EditorTabSize />
          <ReleasesButton />
        </div>
      </div>
    </div>
  );
}
