/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { useState } from 'react';

import { css } from '@emotion/react';

import { useFetchProblem, useLanguage, useStale } from '@/renderer/hooks';

import { placeholderLogo } from '@/renderer/assets/base64Images';

import { XButton } from '@/renderer/components/atoms/buttons/XButton';
import { StaleBall } from '@/renderer/components/atoms/StaleBall';

interface SearchItemProps {
  problemInfo: ProblemInfo;
  onCloseButtonClick?: () => void;
  onItemClick?: () => void;
  disableClose?: boolean;
}

export function SearchItem({
  problemInfo,
  onCloseButtonClick = () => {},
  onItemClick = () => {},
  disableClose = false,
}: SearchItemProps) {
  const { language } = useLanguage();
  const { tierBase64 } = useFetchProblem(problemInfo.number);
  const { isStale } = useStale(problemInfo, language);

  const [isHover, setIsHover] = useState(false);

  const handleMouseEnter = () => {
    setIsHover(true);
  };

  const handleMouseLeave = () => {
    setIsHover(false);
  };

  const CloseButton = (() => {
    if (disableClose) {
      return null;
    }

    if (isHover) {
      return (
        <XButton
          onClick={(e) => {
            onCloseButtonClick();
            e.stopPropagation();
          }}
        />
      );
    }

    if (isStale) {
      return <StaleBall />;
    }

    return null;
  })();

  return (
    <li
      css={(theme) => css`
        display: flex;
        align-items: center;
        justify-content: space-between;

        padding: 2px 8px;

        border-radius: 4px;

        user-select: none;
        outline: none;
        list-style: none;
        cursor: pointer;

        &:hover {
          background-color: ${theme.colors.hover};
        }

        &:focus {
          background-color: ${theme.colors.hover};
        }

        &:focus,
        &:hover {
          & * {
            opacity: 1;
          }
        }
      `}
      className="history-item"
      onClick={onItemClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      tabIndex={-1}
    >
      <div
        css={css`
          display: flex;
          gap: 0.5rem;
          flex: 1;
          overflow: hidden;
        `}
      >
        <img
          src={tierBase64 || placeholderLogo}
          css={css`
            width: 0.75rem;
          `}
        />

        <p
          css={(theme) => css`
            width: 100%;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            color: ${theme.colors.fg};
          `}
        >
          {`${problemInfo.number}번: ${problemInfo.name}`}
        </p>
      </div>

      <div
        css={css`
          display: flex;
          justify-content: center;
          align-items: center;

          width: 1rem;
          aspect-ratio: 1/1;
        `}
      >
        {CloseButton}
      </div>
    </li>
  );
}
