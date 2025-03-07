import { css } from '@emotion/react';

import { ReleasesButton } from '@/renderer/components/molecules/ReleasesButton';
import { StorageButton } from '@/renderer/components/molecules/StorageButton';
import { ManualButton } from '@/renderer/components/molecules/ManualButton';
import { EditorTabSize } from '@/renderer/components/molecules/EditorTabSize';
import { VimModeText } from '@/renderer/components/molecules/VimModeText';
import { AppUpdaterInfo } from '@/renderer/components/molecules/AppUpdaterInfo';
import { TourButton } from '@/renderer/components/molecules/TourButton';

export function Footer() {
  return (
    <div
      css={(theme) => css`
        width: 100%;
        border-top: 1px solid ${theme.colors.border};
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
        <ManualButton />
        <TourButton />
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
  );
}
