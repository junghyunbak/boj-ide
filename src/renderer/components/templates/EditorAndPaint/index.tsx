import { css } from '@emotion/react';

import { zIndex } from '@/renderer/styles';

import { RowLine } from '@/renderer/components/atoms/lines/RowLIne';

import { EditorHeader } from '@/renderer/components/organisms/EditorHeader';
import { EditorContent } from '@/renderer/components/organisms/EditorContent';

import { EditorPaint } from '@/renderer/components/molecules/EditorPaint';
import { EditorPaintController } from '@/renderer/components/molecules/EditorPaintController';
import { CaptureCodeButton } from '@/renderer/components/molecules/CaptureCodeButton';
import { SplitLayout } from '@/renderer/components/molecules/SplitLayout';
import { PaintExpandButton } from '@/renderer/components/molecules/PaintExpandButton';

import { useLayout, useModifyLayout } from '@/renderer/hooks';

export function EditorAndPaint() {
  const { isPaintOpen, isPaintExpand, paintRatio } = useLayout();

  const { updatePaintRatio } = useModifyLayout();

  return (
    <SplitLayout>
      {/**
       * fragment를 사용하여 한번에 Left, Resizer를 렌더링 할 경우
       * 올바르게 렌더링되지 않음.
       */}
      {isPaintOpen && (
        <SplitLayout.Left initialRatio={paintRatio} onRatioChange={updatePaintRatio}>
          <div
            css={css`
              width: 100%;
              height: 100%;

              display: flex;

              overflow: hidden;

              ${isPaintExpand
                ? css`
                    position: absolute;
                    z-index: ${zIndex.paint.expanded};
                  `
                : css`
                    position: relative;
                    z-index: ${zIndex.paint.default};
                  `}
            `}
          >
            <EditorPaintController />
            <EditorPaint />

            <div
              css={css`
                position: absolute;
                right: 0;
                bottom: 0;
                padding: 0.5rem;
              `}
            >
              <CaptureCodeButton />
            </div>

            <div
              css={css`
                position: absolute;
                right: 0;
                top: 0;
                padding: 0.5rem;
              `}
            >
              <PaintExpandButton />
            </div>
          </div>
        </SplitLayout.Left>
      )}

      {isPaintOpen && <SplitLayout.Resizer zIndex={zIndex.resizer.paint} />}

      <SplitLayout.Right>
        <div
          css={css`
            display: flex;
            flex-direction: column;
            width: 100%;
            height: 100%;
          `}
        >
          <EditorHeader />
          <RowLine />
          <EditorContent />
        </div>
      </SplitLayout.Right>
    </SplitLayout>
  );
}
