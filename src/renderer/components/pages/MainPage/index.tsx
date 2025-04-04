import { css } from '@emotion/react';

import { zIndex } from '@/renderer/styles';

import { RowLine } from '@/renderer/components/atoms/lines/RowLIne';

import { AlertModal } from '@/renderer/components/molecules/AlertModal';
import { ConfirmModal } from '@/renderer/components/molecules/ConfirmModal';
import { BojView } from '@/renderer/components/molecules/BojView';
import { TabAfterImage } from '@/renderer/components/molecules/TabAfterImage';
import { SplitLayout } from '@/renderer/components/molecules/SplitLayout';
import { Toast } from '@/renderer/components/molecules/Toast';

import { Nav } from '@/renderer/components/organisms/Nav';
import { Footer } from '@/renderer/components/organisms/Footer';
import { Tabs } from '@/renderer/components/organisms/Tabs';
import { TitleBar } from '@/renderer/components/organisms/TitleBar';

import { EditorAndPaint } from '@/renderer/components/templates/EditorAndPaint';
import { Output } from '@/renderer/components/templates/Output';

import { useLayout, useModifyDrag, useModifyLayout } from '@/renderer/hooks';

import { ExpandedPaintStandardBox } from './index.style';

export function MainPage() {
  const { webviewRatio, editorRatio } = useLayout();

  const { updateWebviewRatio, updateEditorRatio } = useModifyLayout();
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
                  <EditorAndPaint />
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

      <Toast />
      <AlertModal />
      <ConfirmModal />
      <TabAfterImage />
    </div>
  );
}
