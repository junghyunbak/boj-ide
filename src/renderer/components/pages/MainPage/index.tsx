import { css } from '@emotion/react';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { useHorizontalLayout } from '@/renderer/hooks';

import { Nav } from '@/renderer/components/organisms/Nav';
import { VerticalResizer } from '@/renderer/components/atoms/lines/VerticalResizer';
import { HorizontalResizer } from '@/renderer/components/atoms/lines/HorizontalResizer';
import { AlertModal } from '@/renderer/components/molecules/AlertModal';
import { ConfirmModal } from '@/renderer/components/molecules/ConfirmModal';
import { BojView } from '@/renderer/components/molecules/BojView';
import { Footer } from '@/renderer/components/organisms/Footer';
import { Tabs } from '@/renderer/components/organisms/Tabs';
import { Editor } from '@/renderer/components/templates/Editor';
import { RowLine } from '@/renderer/components/atoms/lines/RowLIne';
import { Output } from '@/renderer/components/templates/Output';
import { TabAfterImage } from '@/renderer/components/molecules/TabAfterImage';
import { EditorPaint } from '@/renderer/components/molecules/EditorPaint';

export function MainPage() {
  // TODO: layout 관련 상태, 훅 템플릿 단위로 찢기
  const [isPaintOpen] = useStore(useShallow((s) => [s.isPaintOpen]));

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

  const {
    leftRef: leftRef3,
    resizerRef: resizerRef3,
    containerRef: containerRef3,
  } = useHorizontalLayout({
    onRatioChange(ratio) {
      useStore.getState().setPaintLeftRatio(ratio);
    },
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
      <Tabs />
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
                  height: ${useStore.getState().topRatio}%;
                  width: 100%;
                `}
              >
                <div
                  css={css`
                    width: 100%;
                    height: 100%;
                    display: flex;
                  `}
                  ref={containerRef3}
                >
                  {isPaintOpen && (
                    <>
                      <div
                        ref={leftRef3}
                        css={css`
                          width: ${useStore.getState().paintLeftRatio}%;
                        `}
                      >
                        <EditorPaint />
                      </div>
                      <VerticalResizer ref={resizerRef3} />
                    </>
                  )}
                  <div
                    css={css`
                      flex: 1;
                      overflow: hidden;
                      position: relative;
                    `}
                  >
                    <div
                      css={css`
                        position: absolute;
                        inset: 0;
                      `}
                    >
                      <Editor />
                    </div>
                  </div>
                </div>
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
      <TabAfterImage />
    </div>
  );
}
