/* eslint-disable react/jsx-no-constructed-context-values */
import { useEffect, useRef, useState } from 'react';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { useTab } from '@/renderer/hooks';

import { getElementFromChildren } from '@/renderer/utils';

import { TabAfterImage } from '@/renderer/components/molecules/TabAfterImage';

import { MovableTabTopBorder } from './MovableTabTopBorder';
import { MovableTabContext, MovableTabValue } from './MovableTabContext';
import { MovableTabBottomBorder } from './MovableTabBottomBorder';
import { MovableTabLeftBorder } from './MovableTabLeftBorder';
import { MovableTabRightBorder } from './MovableTabRightBorder';
import { MovableTabContent } from './MovableTabContent';
import { MovableTabLeftLine, MovableTabRightLine } from './MovableTabLine';

import { TabLayout } from './index.style';

const TopBorderType = (<MovableTabTopBorder />).type;
const BottomBorderType = (<MovableTabBottomBorder />).type;
const LeftBorderType = (<MovableTabLeftBorder />).type;
const RightBorderType = (<MovableTabRightBorder />).type;
const ContentType = (<MovableTabContent />).type;
const LeftLineType = (<MovableTabLeftLine />).type;
const RightLineType = (<MovableTabRightLine />).type;

interface MovableTabImplProps extends MovableTabValue {
  polyfill?: boolean;
  onClick?: () => void;
}

function MovableTabImpl({
  tabIndex,
  isSelect = false,
  polyfill = false,
  ghost = false,
  children,
  onClick = () => {},
}: React.PropsWithChildren<MovableTabImplProps>) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isAfterImageShow, setIsAfterImageShow] = useState(false);

  const [setIsTabDrag] = useStore(useShallow((s) => [s.setIsTabDrag])); // for tabs
  const [setIsDrag] = useStore(useShallow((s) => [s.setIsDrag])); // for webview
  const [setDestTabIndex] = useStore(useShallow((s) => [s.setDestTabIndex]));

  const { reorderTab } = useTab();

  /**
   * 드래그 이벤트 등록
   */
  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return function cleanup() {};
    }

    let isClicked: boolean = false;

    const disableDrag = polyfill || ghost;

    const handleTabMouseDown = () => {
      if (disableDrag) {
        return;
      }

      isClicked = true;
      setIsDrag(true);
    };

    const handleTabMouseMove = (e: MouseEvent) => {
      /**
       * 드래그 중 일때 잔상이 보이도록 드래그 중임을 mousemove에서 처리
       */
      if (isClicked) {
        setIsAfterImageShow(true);
        setIsTabDrag(true);
      }

      const [{ x: containerX, width: containerWidth }] = container.getClientRects();
      const { clientX } = e;

      const startX = containerX;
      const middleX = containerX + (disableDrag ? containerWidth : containerWidth / 2);
      const endX = containerX + containerWidth;

      if (startX < clientX && clientX <= middleX) {
        setDestTabIndex(tabIndex);
      } else if (middleX < clientX && clientX <= endX) {
        setDestTabIndex(tabIndex + 1);
      }
    };

    const handleWindowMouseUp = () => {
      const { destTabIndex } = useStore.getState();

      if (isClicked && destTabIndex !== null) {
        reorderTab(tabIndex, destTabIndex);
      }

      isClicked = false;
      setIsDrag(false);
      setIsTabDrag(false);
      setIsAfterImageShow(false);
    };

    const handleMouseRightButtonClick = (e: MouseEvent) => {
      e.preventDefault();
    };

    container.addEventListener('contextmenu', handleMouseRightButtonClick);
    container.addEventListener('mousedown', handleTabMouseDown);
    container.addEventListener('mousemove', handleTabMouseMove);
    window.addEventListener('mouseup', handleWindowMouseUp);

    return function cleanup() {
      if (!container) {
        return;
      }

      container.removeEventListener('contextmenu', handleMouseRightButtonClick);
      container.removeEventListener('mousedown', handleTabMouseDown);
      container.removeEventListener('mousemove', handleTabMouseMove);
      window.removeEventListener('mouseup', handleWindowMouseUp);
    };
  }, [tabIndex, polyfill, reorderTab, setDestTabIndex, setIsTabDrag, setIsDrag, ghost]);

  /**
   * 탭 생성 시 스크롤을 요소 위치로 이동
   */
  useEffect(() => {
    if (isSelect && containerRef.current) {
      containerRef.current.scrollIntoView();
    }
  }, [isSelect]);

  /**
   * 탭 클릭 시 스크롤을 요소 위치로 이동
   */
  const handleTabClick = () => {
    onClick();

    if (containerRef.current) {
      containerRef.current.scrollIntoView();
    }
  };

  const TopBorder = getElementFromChildren(children, TopBorderType);
  const BottomBorder = getElementFromChildren(children, BottomBorderType);
  const LeftBorder = getElementFromChildren(children, LeftBorderType);
  const RightBorder = getElementFromChildren(children, RightBorderType);

  const Content = getElementFromChildren(children, ContentType);

  const LeftLine = getElementFromChildren(children, LeftLineType);
  const RightLine = getElementFromChildren(children, RightLineType);

  return (
    <MovableTabContext.Provider value={{ isSelect, tabIndex, ghost }}>
      <TabLayout ref={containerRef} onClick={handleTabClick} ghost={ghost} polyfill={polyfill}>
        {TopBorder}
        {RightBorder}
        {BottomBorder}

        {LeftLine}
        {Content}
        {RightLine}
      </TabLayout>

      {isAfterImageShow && (
        <TabAfterImage>
          <TabLayout>
            {TopBorder}
            {LeftBorder}
            {RightBorder}

            {Content}
          </TabLayout>
        </TabAfterImage>
      )}
    </MovableTabContext.Provider>
  );
}

export const MovableTab = Object.assign(MovableTabImpl, {
  MovableTabTopBorder,
  MovableTabBottomBorder,
  MovableTabLeftBorder,
  MovableTabRightBorder,
  MovableTabLeftLine,
  MovableTabRightLine,
  MovableTabContent,
});
