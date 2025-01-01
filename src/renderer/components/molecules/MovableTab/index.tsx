import { PropsWithChildren, useEffect, useRef, useState } from 'react';
import { css } from '@emotion/react';
import { useShallow } from 'zustand/shallow';
import { useStore } from '@/renderer/store';
import { useTab } from '@/renderer/hooks';
import DomToImage from 'dom-to-image';

interface MovableTabProps extends PropsWithChildren {
  index: number;
  polyfill?: boolean;
}

export function MovableTab({ children, index, polyfill = false }: MovableTabProps) {
  const [setCurrentAfterImageUrl] = useStore(useShallow((s) => [s.setCurrentAfterImageUrl]));
  const [setIsTabDrag] = useStore(useShallow((s) => [s.setIsTabDrag]));

  const containerRef = useRef<HTMLDivElement | null>(null);

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

    const handleTabMouseDown = () => {
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
      const { destIndex } = useStore.getState();

      if (isSelect && destIndex !== null) {
        reorderTab(index, destIndex);
      }

      isSelect = false;
      setIsTabDrag(false);
      setCurrentAfterImageUrl('');
    };

    const handleTabMouseMove = (e: MouseEvent) => {
      if (!(container instanceof HTMLElement)) {
        return;
      }

      /**
       * 요소 위에서 마우스 왼쪽 버튼을 클릭한 채 움직여야 발동되므로,
       * 요소 내에서 발동하는 mousemove 이벤트일지언정, 드래그중임을 설정하기에 충분하다.
       */
      if (isSelect) {
        setIsTabDrag(true);
      }

      const [{ x: containerX, width: containerWidth }] = container.getClientRects();
      const { clientX } = e;

      const { setTargetIndex } = useStore.getState();

      const startX = containerX;
      const middleX = containerX + (polyfill ? containerWidth : containerWidth / 2);
      const endX = containerX + containerWidth;

      if (startX < clientX && clientX <= middleX) {
        setTargetIndex(index);
      } else if (middleX < clientX && clientX <= endX) {
        setTargetIndex(index + 1);
      }
    };

    const handleTabMouseLeave = () => {
      if (containerRef.current) {
        containerRef.current.style.border = 'none';
      }
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
  }, [afterImageUrl, index, polyfill, reorderTab, setCurrentAfterImageUrl, setIsTabDrag]);

  return (
    <div
      ref={containerRef}
      css={css`
        display: flex;
        width: ${polyfill ? '100%' : 'auto'};
        height: ${polyfill ? '100%' : 'auto'};
      `}
    >
      <TargetLine index={index} />
      {children}
      <TargetLine index={index + 1} />
    </div>
  );
}

function TargetLine({ index }: { index: number }) {
  const [isTabDrag] = useStore(useShallow((s) => [s.isTabDrag]));
  const [destIndex] = useStore(useShallow((s) => [s.destIndex]));

  const isHidden = !isTabDrag || destIndex !== index;

  return (
    <div
      css={css`
        border-color: ${isHidden ? 'transparent' : 'gray'};
        border-style: solid;
        border-width: 0;
        border-left-width: ${index === 0 ? 2 : 1}px;
      `}
    />
  );
}
