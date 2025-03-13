import { useCallback } from 'react';

import { css } from '@emotion/react';

import { ReactComponent as Github } from '@/renderer/assets/svgs/github.svg';

export function GithubButton() {
  const handleGithubButtonClick = useCallback(() => {
    window.open('https://github.com/junghyunbak/boj-ide', '_blank');
  }, []);

  return (
    <button
      type="button"
      onClick={handleGithubButtonClick}
      css={(theme) => css`
        border: none;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 0.7rem;
        background-color: ${theme.colors.primaryfg};
        color: ${theme.colors.active};
        cursor: pointer;
        svg {
          height: 12px;
        }
      `}
    >
      <Github />
    </button>
  );
}
