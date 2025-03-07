import { useCallback, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

import { css } from '@emotion/react';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { useTour, useWindowEvent } from '@/renderer/hooks';

import { XButton } from '@/renderer/components/atoms/buttons/XButton';
import { ActionButton } from '@/renderer/components/atoms/buttons/ActionButton';

import { TourDimmedBox, TourLayout, TourPopoverBox, TourPopoverLayout } from './index.style';

interface TourOverlayProps extends React.PropsWithChildren {
  title: string;
  myTourStep: number;
  tourRef: React.MutableRefObject<HTMLElement | null>;
  guideLoc?:
    | 'leftTop'
    | 'left'
    | 'leftBottom'
    | 'rightTop'
    | 'right'
    | 'rightBottom'
    | 'topLeft'
    | 'top'
    | 'topRight'
    | 'bottomLeft'
    | 'bottom'
    | 'bottomRight';
}

export function TourOverlay(props: TourOverlayProps) {
  const [tourStep] = useStore(useShallow((s) => [s.tourStep]));

  const { myTourStep } = props;

  if (tourStep !== myTourStep) {
    return null;
  }

  return <TourOverlayContent {...props} />;
}

function TourOverlayContent({ tourRef, children, myTourStep, title, guideLoc = 'rightBottom' }: TourOverlayProps) {
  const [leftX, setLeftX] = useState(0);
  const [rightX, setRightX] = useState(0);
  const [topY, setTopY] = useState(0);
  const [bottomY, setBottomY] = useState(0);
  const [tourItemWidth, setTourItemWidth] = useState(0);
  const [tourItemHeight, setTourItemHeight] = useState(0);

  const popoverRef = useRef<HTMLDivElement>(null);

  const { MAX_TOUR_STEP, isFirstStep, isLastStep, goNextStep, goPrevStep, closeTourStep } = useTour();

  const updateTourItemInfo = useCallback(() => {
    if (!tourRef.current) {
      return;
    }

    const { x, y, width, height } = tourRef.current.getBoundingClientRect();

    setTourItemWidth(width);
    setTourItemHeight(height);

    setLeftX(x);
    setRightX(x + width);
    setTopY(y);
    setBottomY(y + height);
  }, [tourRef]);

  useEffect(() => {
    updateTourItemInfo();
  }, [updateTourItemInfo]);

  useWindowEvent(updateTourItemInfo, [updateTourItemInfo], 'resize');

  useWindowEvent(
    (e) => {
      switch (e.key) {
        case 'ArrowLeft':
          goPrevStep();
          break;
        case 'ArrowRight':
          goNextStep();
          break;
        default:
          break;
      }
    },
    [goPrevStep, goNextStep],
    'keydown',
  );

  const guidePopoverInset = (() => {
    const popover = popoverRef.current;

    if (!popover) {
      /**
       * 윈도우 밖 position을 주어 위치 이동으로 인한 깜박임이 보이지 않도록 한다.
       */
      return `${window.innerHeight}px auto auto auto`;
    }

    const { width, height } = popover.getBoundingClientRect();

    switch (guideLoc) {
      case 'leftTop':
        return `${topY}px ${window.innerWidth - leftX}px auto auto`;
      case 'left':
        return `${topY + tourItemHeight / 2 - height / 2}px ${window.innerWidth - leftX}px auto auto`;
      case 'leftBottom':
        return `${bottomY - height}px ${window.innerWidth - leftX}px auto auto`;
      case 'rightTop':
        return `${topY}px ${window.innerWidth - rightX - width}px auto auto`;
      case 'right':
        return `${topY + tourItemHeight / 2 - height / 2}px ${window.innerWidth - rightX - width}px auto auto`;
      case 'rightBottom':
        return `${topY + tourItemHeight - height}px ${window.innerWidth - rightX - width}px auto auto`;
      case 'topLeft':
        return `auto auto ${window.innerHeight - topY}px ${leftX}px`;
      case 'top':
        return `auto auto ${window.innerHeight - topY}px ${leftX + tourItemWidth / 2 - width / 2}px`;
      case 'topRight':
        return `auto auto ${window.innerHeight - topY}px ${leftX + tourItemWidth - width}px`;
      case 'bottomLeft':
        return `auto auto ${window.innerHeight - bottomY - height}px ${leftX}px`;
      case 'bottom':
        return `auto auto ${window.innerHeight - bottomY - height}px ${leftX + tourItemWidth / 2 - width / 2}px`;
      case 'bottomRight':
        return `auto auto ${window.innerHeight - bottomY - height}px ${leftX + tourItemWidth - width}px`;
      default:
        return '';
    }
  })();

  return ReactDOM.createPortal(
    <TourLayout>
      <TourDimmedBox
        style={{
          left: 0,
          right: window.innerWidth - leftX,
          top: topY,
          bottom: window.innerHeight - bottomY,
        }}
      />

      <TourDimmedBox
        style={{
          left: rightX,
          right: 0,
          top: topY,
          bottom: window.innerHeight - bottomY,
        }}
      />

      <TourDimmedBox
        style={{
          top: 0,
          bottom: window.innerHeight - topY,
          left: 0,
          right: 0,
        }}
      />

      <TourDimmedBox
        style={{
          top: bottomY,
          bottom: 0,
          left: 0,
          right: 0,
        }}
      />

      <TourPopoverLayout
        style={{
          inset: guidePopoverInset,
        }}
        ref={popoverRef}
      >
        <TourPopoverBox>
          <div
            css={css`
              display: flex;
              justify-content: space-between;
              align-items: center;
            `}
          >
            <h3
              css={css`
                margin: 0;
                color: black;
              `}
            >
              {title}
            </h3>

            <XButton onClick={closeTourStep} />
          </div>

          <div
            css={(theme) => css`
              flex: 1;
              color: black;
              display: flex;
              flex-direction: column;
              & * {
                margin: 0;
              }
              a {
                color: ${theme.colors.primarybg};
              }
              code {
                border-radius: 4px;
                padding: 2px 4px;
                color: ${theme.colors.fg};
                background-color: ${theme.colors.code};
                border: 1px solid ${theme.colors.border};
                font-size: 12px;
              }
            `}
          >
            {children}
          </div>

          <div
            css={css`
              display: flex;
              justify-content: space-between;
              align-items: end;
            `}
          >
            <p
              css={css`
                color: black;
              `}
            >{`${myTourStep} / ${MAX_TOUR_STEP}`}</p>

            <div
              css={css`
                display: flex;
                gap: 0.25rem;
              `}
            >
              <ActionButton onClick={goPrevStep} disabled={isFirstStep}>
                〈 이전
              </ActionButton>
              <ActionButton onClick={goNextStep}>{isLastStep ? '시작' : '다음 〉'}</ActionButton>
            </div>
          </div>
        </TourPopoverBox>
      </TourPopoverLayout>
    </TourLayout>,
    document.querySelector('#tour')!,
  );
}
