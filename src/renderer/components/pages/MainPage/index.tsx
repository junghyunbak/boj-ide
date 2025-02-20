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

export function MainPage() {
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
        <SplitLayout
          initialLeftRatio={useStore.getState().leftRatio}
          onRatioChange={useStore.getState().setLeftRatio}
          zIndex={zIndex.resizer.webview}
        >
          <SplitLayout.Left>
            <BojView />
          </SplitLayout.Left>

          <SplitLayout.Right>
            <SplitLayout
              initialLeftRatio={useStore.getState().topRatio}
              onRatioChange={useStore.getState().setTopRatio}
              zIndex={zIndex.resizer.editor}
              reverse
            >
              <SplitLayout.Left>
                <PaintAndEditor />
              </SplitLayout.Left>

              <SplitLayout.Right>
                <Output />
              </SplitLayout.Right>
            </SplitLayout>
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
    <SplitLayout
      initialLeftRatio={useStore.getState().paintLeftRatio}
      onRatioChange={useStore.getState().setPaintLeftRatio}
      zIndex={zIndex.resizer.paint}
      hiddenLeft={!isPaintOpen}
    >
      <SplitLayout.Left>
        <EditorPaint />
      </SplitLayout.Left>
      <SplitLayout.Right>
        <Editor />
      </SplitLayout.Right>
    </SplitLayout>
  );
}
