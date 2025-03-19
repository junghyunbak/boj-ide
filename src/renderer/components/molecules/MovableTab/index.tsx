/* eslint-disable react/jsx-no-constructed-context-values */
import { useCallback, useEffect, useRef, useState } from 'react';

import { useStore } from '@/renderer/store';

import { useEventElement, useEventWindow, useModifyDrag, useModifyTab } from '@/renderer/hooks';

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
  const isClicked = useRef(false);

  const [isHover, setIsHover] = useState(false);
  const [isAfterImageShow, setIsAfterImageShow] = useState(false);

  const { updateIsResizerDrag, updateIsTabDrag, updateDestTabIndex } = useModifyDrag();
  const { reorderTab } = useModifyTab();

  /**
   * 드래그 이벤트 등록
   */
  const disableDrag = polyfill || ghost;

  useEventElement(
    () => {
      if (disableDrag) {
        return;
      }

      isClicked.current = true;
      updateIsResizerDrag(true);
    },
    [disableDrag, updateIsResizerDrag],
    'mousedown',
    containerRef.current,
  );

  useEventElement(
    (e) => {
      if (!(containerRef.current instanceof HTMLElement)) {
        return;
      }

      /**
       * 드래그 중 일때 잔상이 보이도록 드래그 중임을 mousemove에서 처리
       */
      if (isClicked.current) {
        setIsAfterImageShow(true);
        updateIsTabDrag(true);
      }

      const [{ x: containerX, width: containerWidth }] = containerRef.current.getClientRects();
      const { clientX } = e;

      const startX = containerX;
      const middleX = containerX + (disableDrag ? containerWidth : containerWidth / 2);
      const endX = containerX + containerWidth;

      if (startX < clientX && clientX <= middleX) {
        updateDestTabIndex(tabIndex);
      } else if (middleX < clientX && clientX <= endX) {
        updateDestTabIndex(tabIndex + 1);
      }
    },
    [disableDrag, tabIndex, updateDestTabIndex, updateIsTabDrag],
    'mousemove',
    containerRef.current,
  );

  useEventElement(
    (e) => {
      e.preventDefault();
    },
    [],
    'contextmenu',
    containerRef.current,
  );

  useEventWindow(
    () => {
      const { destTabIndex } = useStore.getState();

      if (isClicked.current && destTabIndex !== null) {
        reorderTab(tabIndex, destTabIndex);
      }

      isClicked.current = false;
      updateIsResizerDrag(false);
      updateIsTabDrag(false);
      setIsAfterImageShow(false);
    },
    [reorderTab, tabIndex, updateIsResizerDrag, updateIsTabDrag],
    'mouseup',
  );

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
  const handleTabClick = useCallback(() => {
    onClick();

    if (containerRef.current) {
      containerRef.current.scrollIntoView();
    }
  }, [onClick]);

  const handleMouseEnter = useCallback(() => {
    setIsHover(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHover(false);
  }, []);

  const TopBorder = getElementFromChildren(children, TopBorderType);
  const BottomBorder = getElementFromChildren(children, BottomBorderType);
  const LeftBorder = getElementFromChildren(children, LeftBorderType);
  const RightBorder = getElementFromChildren(children, RightBorderType);

  const Content = getElementFromChildren(children, ContentType);

  const LeftLine = getElementFromChildren(children, LeftLineType);
  const RightLine = getElementFromChildren(children, RightLineType);

  return (
    <MovableTabContext.Provider value={{ isSelect, tabIndex, ghost, isHover }}>
      <TabLayout
        ref={containerRef}
        onClick={handleTabClick}
        polyfill={polyfill}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
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
