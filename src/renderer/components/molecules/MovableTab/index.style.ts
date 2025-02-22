import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { color } from '@/renderer/styles';

type TabState = {
  isSelect?: boolean;
  polyfill?: boolean;
};

export const TabLayout = styled.div<TabState>`
  position: relative;
  cursor: pointer;

  ${({ isSelect = false }) =>
    isSelect
      ? css`
          background-color: white;
        `
      : css`
          background-color: #f9f9f9;
        `};

  ${({ polyfill = false }) =>
    polyfill
      ? css`
          flex: 1;
          cursor: auto;
          background-color: transparent;
        `
      : css``}
`;

export const SelectTopBorder = styled.div`
  position: absolute;
  top: 1px;
  left: 0;
  right: 0;

  background-color: ${color.primaryBg};

  height: 1px;
`;

export const TopBorder = styled.div<TabState>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;

  background-color: lightgray;

  height: 1px;

  ${({ polyfill = false }) =>
    polyfill
      ? css`
          height: 0;
        `
      : css``}
`;

export const BottomBorder = styled.div<TabState>`
  position: absolute;
  bottom: 0;
  left: 0;
  right: ${({ isSelect = false }) => (isSelect ? 'calc(100% - 1px)' : 0)};

  background-color: lightgray;

  height: 1px;
`;

export const LeftBorder = styled.div<TabState>`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;

  background-color: lightgray;

  width: 1px;

  ${({ polyfill = false }) =>
    polyfill
      ? css`
          width: 0px;
        `
      : css``}
`;

export const RightBorder = styled.div<TabState>`
  position: absolute;
  top: 0;
  bottom: 0;
  right: -1px;

  background-color: lightgray;

  width: 1px;

  ${({ polyfill = false }) =>
    polyfill
      ? css`
          width: 0px;
        `
      : css``}
`;

export const TabContent = styled.div<TabState>`
  display: flex;
  gap: 0.5rem;
  align-items: center;

  padding: 0.5rem 0.8rem;

  &:hover * {
    opacity: 1;
  }
`;

export const TabCloseButtonBox = styled.div<TabState>`
  ${({ isSelect }) =>
    isSelect
      ? css`
          opacity: 1;
        `
      : css`
          opacity: 0;
        `}
`;
