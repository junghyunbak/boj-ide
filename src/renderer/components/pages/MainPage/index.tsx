import { Output } from '@/renderer/components/templates/Output';
import { Nav } from '@/renderer/components/organisms/Nav';
import { VerticalResizer } from '@/renderer/components/atoms/lines/VerticalResizer';
import { HorizontalResizer } from '@/renderer/components/atoms/lines/HorizontalResizer';
import { AlertModal } from '@/renderer/components/molecules/AlertModal';
import { ConfirmModal } from '@/renderer/components/molecules/ConfirmModal';
import { BojView } from '@/renderer/components/molecules/BojView';
import { Footer } from '@/renderer/components/organisms/Footer';
import { Tab } from '@/renderer/components/organisms/Tab';
import { Editor } from '@/renderer/components/templates/Editor';
import { RowLine } from '@/renderer/components/atoms/lines/RowLIne';
import { useHorizontalLayout } from '@/renderer/hooks';
import { useStore } from '@/renderer/store';
import { css } from '@emotion/react';

export function MainPage() {
  const { leftRef, containerRef, resizerRef } = useHorizontalLayout({
    onRatioChange: (ratio) => {
      useStore.getState().setLeftRatio(ratio);
    },
  });

  const {
    leftRef: leftRef2,
    containerRef: containerRef2,
    resizerRef: resizerRef2,
  } = useHorizontalLayout({
    onRatioChange: (ratio) => {
      useStore.getState().setTopRatio(ratio);
    },
    reverse: true,
  });

  return (
    <div
      css={css`
        position: fixed;
        inset: 0;
        display: flex;
        flex-direction: column;
      `}
    >
      <Tab />
      <Nav />
      <RowLine />

      <div
        css={css`
          flex: 1;
          overflow: hidden;
        `}
      >
        <div
          ref={containerRef}
          css={css`
            width: 100%;
            height: 100%;
            display: flex;
          `}
        >
          <div
            ref={leftRef}
            css={css`
              width: ${useStore.getState().leftRatio}%;
              height: 100%;
            `}
          >
            <BojView />
          </div>

          <VerticalResizer ref={resizerRef} />

          <div
            css={css`
              flex: 1;
              overflow: hidden;
            `}
          >
            <div
              ref={containerRef2}
              css={css`
                height: 100%;
                width: 100%;
                display: flex;
                flex-direction: column;
              `}
            >
              <div
                ref={leftRef2}
                css={css`
                  height: 50%;
                  width: 100%;
                `}
              >
                <Editor />
              </div>

              <HorizontalResizer ref={resizerRef2} />

              <div
                css={css`
                  flex: 1;
                  overflow: hidden;
                `}
              >
                <Output />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      <AlertModal />
      <ConfirmModal />
    </div>
  );
}
