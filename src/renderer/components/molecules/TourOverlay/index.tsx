import { useCallback, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

import { css } from '@emotion/react';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { useTour, useEventWindow, useModifyTour } from '@/renderer/hooks';

import { ActionButton } from '@/renderer/components/atoms/buttons/ActionButton';

import { ReactComponent as X } from '@/renderer/assets/svgs/x.svg';

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

  const [tourRect, setTourRect] = useState<DOMRect>(new DOMRect(0, 0, 0, 0));

  const popoverRef = useRef<HTMLDivElement>(null);

  const { MAX_TOUR_STEP, isFirstStep, isLastStep } = useTour();
  const { goNextStep, goPrevStep, closeTourStep } = useModifyTour();

  const updateTourItemInfo = useCallback(() => {
    if (!tourRef.current) {
      return;
    }

    const rect = tourRef.current.getBoundingClientRect();

    const { x, y, width, height } = rect;

    setTourRect(rect);

    setLeftX(x);
    setRightX(x + width);
    setTopY(y);
    setBottomY(y + height);
  }, [tourRef]);

  useEffect(() => {
    updateTourItemInfo();
  }, [updateTourItemInfo]);

  useEventWindow(updateTourItemInfo, [updateTourItemInfo], 'resize');

  useEventWindow(
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

    const { width: tourItemWidth, height: tourItemHeight } = tourRect;

    switch (guideLoc) {
      case 'leftTop':
        return `${topY}px ${Math.min(window.innerWidth - leftX, window.innerWidth - width)}px auto auto`;
      case 'left':
        return `${topY + tourItemHeight / 2 - height / 2}px ${Math.min(window.innerWidth - leftX, window.innerWidth - width)}px auto auto`;
      case 'leftBottom':
        return `${bottomY - height}px ${Math.min(window.innerWidth - leftX, window.innerWidth - width)}px auto auto`;
      case 'rightTop':
        return `${topY}px ${Math.max(window.innerWidth - rightX - width, 0)}px auto auto`;
      case 'right':
        return `${topY + tourItemHeight / 2 - height / 2}px ${Math.max(window.innerWidth - rightX - width, 0)}px auto auto`;
      case 'rightBottom':
        return `${topY + tourItemHeight - height}px ${Math.max(window.innerWidth - rightX - width, 0)}px auto auto`;
      case 'topLeft':
        return `auto auto ${Math.min(window.innerHeight - topY, window.innerHeight - height)}px ${leftX}px`;
      case 'top':
        return `auto auto ${Math.min(window.innerHeight - topY, window.innerHeight - height)}px ${leftX + tourItemWidth / 2 - width / 2}px`;
      case 'topRight':
        return `auto auto ${Math.min(window.innerHeight - topY, window.innerHeight - height)}px ${leftX + tourItemWidth - width}px`;
      case 'bottomLeft':
        return `auto auto ${Math.max(window.innerHeight - bottomY - height, 0)}px ${leftX}px`;
      case 'bottom':
        return `auto auto ${Math.max(window.innerHeight - bottomY - height, 0)}px ${leftX + tourItemWidth / 2 - width / 2}px`;
      case 'bottomRight':
        return `auto auto ${Math.max(window.innerHeight - bottomY - height, 0)}px ${leftX + tourItemWidth - width}px`;
      default:
        return '';
    }
  })();

  return ReactDOM.createPortal(
    <TourLayout>
      {/**
       * height값을 직접 설정해줘야 Windows에서 paint시 오차가 생기지 않았다.
       */}
      <TourDimmedBox
        style={{
          top: 0,
          left: 0,
          width: '100%',
          height: `${topY}px`,
        }}
      />

      <TourDimmedBox
        style={{
          top: topY,
          left: 0,
          width: `${leftX}px`,
          height: `${tourRect.height}px`,
        }}
      />

      <TourDimmedBox
        style={{
          top: topY,
          left: rightX,
          right: 0,
          height: `${tourRect.height}px`,
        }}
      />

      <TourDimmedBox
        style={{
          top: bottomY,
          right: 0,
          bottom: 0,
          left: 0,
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

            <button
              type="button"
              onClick={closeTourStep}
              css={css`
                border: none;
                background-color: transparent;
                cursor: pointer;
                svg {
                  width: 1rem;
                  height: 1rem;
                }
              `}
            >
              <X />
            </button>
          </div>

          <div
            css={(theme) => css`
              flex: 1;
              color: black;
              display: flex;
              flex-direction: column;
              & * {
                margin: 0;
                white-space: nowrap;
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
