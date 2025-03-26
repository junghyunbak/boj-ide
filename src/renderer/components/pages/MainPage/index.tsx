import { css } from '@emotion/react';

import { zIndex } from '@/renderer/styles';

import { RowLine } from '@/renderer/components/atoms/lines/RowLIne';

import { AlertModal } from '@/renderer/components/molecules/AlertModal';
import { ConfirmModal } from '@/renderer/components/molecules/ConfirmModal';
import { BojView } from '@/renderer/components/molecules/BojView';
import { TabAfterImage } from '@/renderer/components/molecules/TabAfterImage';
import { EditorPaint } from '@/renderer/components/molecules/EditorPaint';
import { SplitLayout } from '@/renderer/components/molecules/SplitLayout';

import { Nav } from '@/renderer/components/organisms/Nav';
import { Footer } from '@/renderer/components/organisms/Footer';
import { Tabs } from '@/renderer/components/organisms/Tabs';
import { TitleBar } from '@/renderer/components/organisms/TitleBar';

import { Editor } from '@/renderer/components/templates/Editor';
import { Output } from '@/renderer/components/templates/Output';

import { useLayout, useModifyDrag, useModifyLayout } from '@/renderer/hooks';

import { ExpandedPaintStandardBox } from './index.style';

export function MainPage() {
  const { webviewRatio, editorRatio, paintRatio, isPaintOpen } = useLayout();

  const { updateWebviewRatio, updateEditorRatio, updatePaintRatio } = useModifyLayout();
  const { updateIsResizerDrag } = useModifyDrag();

  return (
    <div
      css={css`
        position: fixed;
        inset: 0;
        display: flex;
        flex-direction: column;
      `}
    >
      <TitleBar />

      <Tabs />
      <Nav />
      <RowLine />
      <div
        css={css`
          flex: 1;
          overflow: hidden;
        `}
      >
        <SplitLayout>
          <SplitLayout.Left initialRatio={webviewRatio} onRatioChange={updateWebviewRatio}>
            <BojView />
          </SplitLayout.Left>

          <SplitLayout.Resizer
            onDragStart={() => updateIsResizerDrag(true)}
            onDragEnd={() => updateIsResizerDrag(false)}
            zIndex={zIndex.resizer.webview}
          />

          <SplitLayout.Right>
            <ExpandedPaintStandardBox>
              <SplitLayout vertical>
                <SplitLayout.Left initialRatio={editorRatio} onRatioChange={updateEditorRatio}>
                  <SplitLayout>
                    {/**
                     * fragment를 사용하여 한번에 Left, Resizer를 렌더링 할 경우
                     * 올바르게 렌더링되지 않음.
                     */}
                    {isPaintOpen && (
                      <SplitLayout.Left initialRatio={paintRatio} onRatioChange={updatePaintRatio}>
                        <EditorPaint />
                      </SplitLayout.Left>
                    )}

                    {isPaintOpen && <SplitLayout.Resizer zIndex={zIndex.resizer.paint} />}

                    <SplitLayout.Right>
                      <Editor />
                    </SplitLayout.Right>
                  </SplitLayout>
                </SplitLayout.Left>

                <SplitLayout.Resizer
                  zIndex={zIndex.resizer.editor}
                  onDragStart={() => updateIsResizerDrag(true)}
                  onDragEnd={() => updateIsResizerDrag(false)}
                />

                <SplitLayout.Right>
                  <Output />
                </SplitLayout.Right>
              </SplitLayout>
            </ExpandedPaintStandardBox>
          </SplitLayout.Right>
        </SplitLayout>
      </div>

      <Footer />

      <AlertModal />
      <ConfirmModal />
      <TabAfterImage />
    </div>
  );
}
