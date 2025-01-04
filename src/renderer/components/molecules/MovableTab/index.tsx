import { PropsWithChildren, useEffect, useRef, useState } from 'react';

import { css } from '@emotion/react';

import DomToImage from 'dom-to-image';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { color } from '@/renderer/styles';

import { useTab } from '@/renderer/hooks';

import { isParentExist } from '@/renderer/utils';

import { XButton } from '@/renderer/components/atoms/buttons/XButton';
import { TabIndexLine } from '@/renderer/components/molecules/TabIndexLine';

interface MovableTabProps extends PropsWithChildren {
  tabIndex: number;
  isTabSelect?: boolean;
  callbackTabCloseButtonClick?: () => void;
  callbackTabButtonClick?: () => void;
  polyfill?: boolean;
}

export function MovableTab({
  tabIndex,
  isTabSelect = false,
  callbackTabCloseButtonClick = () => {},
  callbackTabButtonClick = () => {},
  polyfill = false,
  children,
}: MovableTabProps) {
  const [setCurrentAfterImageUrl] = useStore(useShallow((s) => [s.setCurrentAfterImageUrl]));
  const [setIsTabDrag] = useStore(useShallow((s) => [s.setIsTabDrag]));
  const [setDestTabIndex] = useStore(useShallow((s) => [s.setDestTabIndex]));

  const containerRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  const { tabs, reorderTab } = useTab();

  const [afterImageUrl, setAfterImageUrl] = useState('');

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    (async () => {
      const imageUrl = await DomToImage.toPng(container);

      setAfterImageUrl(imageUrl);
    })();
  }, [tabs]);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return () => {};
    }

    let isSelect: boolean = false;

    const handleTabMouseDown = (e: MouseEvent) => {
      if (isParentExist(e.target, closeButtonRef.current)) {
        return;
      }

      /**
       * 빈 공간을 채우기 위한 용도로 사용 될 경우,
       * 탭 드래그 동작이 발동해서는 안되므로 `isSelect = true`가 되기 전에 멈춘다.
       */
      if (polyfill) {
        return;
      }

      isSelect = true;
      setCurrentAfterImageUrl(afterImageUrl);
    };

    const handleWindowMouseUp = () => {
      const { destTabIndex } = useStore.getState();

      if (isSelect && destTabIndex !== null) {
        reorderTab(tabIndex, destTabIndex);
      }

      isSelect = false;
      setIsTabDrag(false);
      setCurrentAfterImageUrl('');
    };

    const handleTabMouseMove = (e: MouseEvent) => {
      /**
       * 요소 위에서 마우스 왼쪽 버튼을 클릭한 채 움직여야 발동되므로,
       * 요소 내에서 발동하는 mousemove 이벤트일지언정, 드래그중임을 설정하기에 충분하다.
       */
      if (isSelect) {
        setIsTabDrag(true);
      }

      const [{ x: containerX, width: containerWidth }] = container.getClientRects();
      const { clientX } = e;

      const startX = containerX;
      const middleX = containerX + (polyfill ? containerWidth : containerWidth / 2);
      const endX = containerX + containerWidth;

      if (startX < clientX && clientX <= middleX) {
        setDestTabIndex(tabIndex);
      } else if (middleX < clientX && clientX <= endX) {
        setDestTabIndex(tabIndex + 1);
      }
    };

    const handleTabMouseLeave = () => {
      container.style.border = 'none';
    };

    const handleMouseRightButtonClick = (e: MouseEvent) => {
      e.preventDefault();
    };

    container.addEventListener('contextmenu', handleMouseRightButtonClick);
    container.addEventListener('mousedown', handleTabMouseDown);
    container.addEventListener('mousemove', handleTabMouseMove);
    container.addEventListener('mouseleave', handleTabMouseLeave);
    window.addEventListener('mouseup', handleWindowMouseUp);

    return () => {
      if (!container) {
        return;
      }

      container.addEventListener('contextmenu', handleMouseRightButtonClick);
      container.removeEventListener('mousedown', handleTabMouseDown);
      container.removeEventListener('mousemove', handleTabMouseMove);
      container.removeEventListener('mouseleave', handleTabMouseLeave);
      window.removeEventListener('mouseup', handleWindowMouseUp);
    };
  }, [afterImageUrl, tabIndex, polyfill, reorderTab, setCurrentAfterImageUrl, setDestTabIndex, setIsTabDrag]);

  useEffect(() => {
    if (isTabSelect && containerRef.current) {
      containerRef.current.scrollIntoView();
    }
  }, [isTabSelect]);

  const handleTabClick = () => {
    callbackTabButtonClick();

    if (containerRef.current) {
      containerRef.current.scrollIntoView();
    }
  };

  const handleCloseButtonClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    callbackTabCloseButtonClick();

    /**
     * 버블링을 차단하지 않으면 닫기 동작 뿐만 아니라 탭 클릭 동작도 발생하기 때문에 중요한 코드
     */
    e.stopPropagation();
  };

  return (
    <div
      ref={containerRef}
      css={css`
        display: flex;
        width: ${polyfill ? '100%' : 'auto'};
        height: ${polyfill ? '100%' : 'auto'};
      `}
      onClick={handleTabClick}
    >
      <TabIndexLine tabIndex={tabIndex} />
      {!polyfill && (
        <div
          css={css`
            display: flex;
            gap: 0.5rem;
            align-items: center;
            background-color: white;
            padding: 0.5rem 0.8rem;
            background: ${isTabSelect ? 'white' : 'transparent'};
            border-top: 1px solid ${isTabSelect ? color.primaryBg : 'transparent'};
            border-left: 1px solid ${isTabSelect ? 'lightgray' : 'transparent'};
            border-right: 1px solid ${isTabSelect ? 'lightgray' : 'transparent'};
            cursor: pointer;
            .tab-close-button {
              opacity: ${isTabSelect ? 1 : 0};
            }
            &:hover .tab-close-button {
              opacity: 1;
            }
          `}
        >
          {children}
          <div className="tab-close-button">
            <XButton ref={closeButtonRef} onClick={handleCloseButtonClick} />
          </div>
        </div>
      )}
      <TabIndexLine tabIndex={tabIndex + 1} />
    </div>
  );
}
