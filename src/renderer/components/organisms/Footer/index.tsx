import { css } from '@emotion/react';

import { ReleasesButton } from '@/renderer/components/molecules/ReleasesButton';
import { StorageButton } from '@/renderer/components/molecules/StorageButton';
import { ManualButton } from '@/renderer/components/molecules/ManualButton';
import { EditorTabSize } from '@/renderer/components/molecules/EditorTabSize';

export function Footer() {
  return (
    <div
      css={css`
        width: 100%;
        border-top: 1px solid lightgray;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 0.5rem;
        overflow: hidden;
      `}
    >
      <div>
        <StorageButton />
        <ManualButton />
      </div>

      <div
        css={css`
          display: flex;
        `}
      >
        <EditorTabSize />
        <ReleasesButton />
      </div>
    </div>
  );
}
