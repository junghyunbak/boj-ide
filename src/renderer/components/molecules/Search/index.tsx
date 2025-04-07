import { css } from '@emotion/react';

import { SearchButton } from '@/renderer/components/molecules/Search/SearchButton';
import { SearchModal } from '@/renderer/components/molecules/Search/SearchModal';

export function Search() {
  return (
    <div
      css={css`
        display: flex;
        justify-content: center;

        position: relative;
      `}
    >
      <SearchButton />
      <SearchModal />
    </div>
  );
}
