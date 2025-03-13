import { css } from '@emotion/react';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { zIndex } from '@/renderer/styles';

import { Nav } from '@/renderer/components/organisms/Nav';
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
import { SplitLayout } from '@/renderer/components/molecules/SplitLayout';

import { useLayout, useModifyLayout } from '@/renderer/hooks';

import { ExpandedPaintStandardBox } from './index.style';

export function MainPage() {
  const { webviewRatio, editorRatio } = useLayout();
  const { updateWebviewRatio, updateEditorRatio } = useModifyLayout();

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
        <SplitLayout>
          <SplitLayout.Left initialRatio={webviewRatio} onRatioChange={updateWebviewRatio}>
            <BojView />
          </SplitLayout.Left>

          <SplitLayout.Resizer
            onDragStart={() => useStore.getState().setIsDrag(true)}
            onDragEnd={() => useStore.getState().setIsDrag(false)}
            zIndex={zIndex.resizer.webview}
          />

          <SplitLayout.Right>
            <ExpandedPaintStandardBox>
              <SplitLayout vertical>
                <SplitLayout.Left initialRatio={editorRatio} onRatioChange={updateEditorRatio}>
                  <PaintAndEditor />
                </SplitLayout.Left>

                <SplitLayout.Resizer zIndex={zIndex.resizer.editor} />

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

function PaintAndEditor() {
  const [isPaintOpen] = useStore(useShallow((s) => [s.isPaintOpen]));

  return (
    <SplitLayout>
      {/**
       * fragment를 사용하여 한번에 Left, Resizer를 렌더링 할 경우
       * 올바르게 렌더링되지 않음.
       */}
      {isPaintOpen && (
        <SplitLayout.Left
          initialRatio={useStore.getState().paintLeftRatio}
          onRatioChange={useStore.getState().setPaintLeftRatio}
        >
          <EditorPaint />
        </SplitLayout.Left>
      )}

      {isPaintOpen && <SplitLayout.Resizer zIndex={zIndex.resizer.paint} />}

      <SplitLayout.Right>
        <Editor />
      </SplitLayout.Right>
    </SplitLayout>
  );
}
