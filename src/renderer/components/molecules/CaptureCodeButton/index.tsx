import { useCallback } from 'react';

import { useTheme, css } from '@emotion/react';

import { useEditor, useModifyAlertModal, usePaint } from '@/renderer/hooks';

import { fabric } from 'fabric';

import { ReactComponent as Copy } from '@/renderer/assets/svgs/copy.svg';

export function CaptureCodeButton() {
  const { editorView } = useEditor();
  const { canvas } = usePaint();
  const { fireAlertModal } = useModifyAlertModal();

  const emotionTheme = useTheme();

  const handleCreateImageButtonClick = useCallback(async () => {
    if (!editorView || !canvas) {
      return;
    }

    const canvasObjects = canvas.getObjects();

    if (canvasObjects.length === 0) {
      fireAlertModal('안내', '캔버스에 그림이 없습니다.');
      return;
    }

    let mil = Infinity;
    let mit = Infinity;
    let mar = -Infinity;
    let mab = -Infinity;

    canvasObjects.forEach((obj) => {
      const { top, left, height, width } = obj;

      mil = Math.min(mil, left ?? Infinity);
      mit = Math.min(mit, top ?? Infinity);
      mar = Math.max(mar, (left ?? -Infinity) + (width ?? -Infinity));
      mab = Math.max(mab, (top ?? -Infinity) + (height ?? -Infinity));
    });

    const paddingX = (mar - mil) * 0.1;
    const paddingY = (mab - mit) * 0.1;

    const width = mar - mil + paddingX * 2;
    const height = mab - mit + paddingY * 2;

    const mainCanvas = new fabric.Canvas('mainCanvas', { backgroundColor: emotionTheme.colors.bg, width, height });

    canvasObjects.forEach((obj) =>
      obj.clone((cloneObj: fabric.Object) => {
        mainCanvas.add(
          cloneObj.set({
            left: (cloneObj.left ?? -Infinity) - mil + paddingX,
            top: (cloneObj.top ?? -Infinity) - mit + paddingY,
          }),
        );
      }),
    );

    const result = await window.electron.ipcRenderer.invoke('clipboard-copy-image', {
      data: { dataUrl: mainCanvas.toDataURL({ format: 'png' }) },
    });

    if (result && result.data.isSaved) {
      fireAlertModal('안내', '이미지가 클립보드에 복사되었습니다.');
    }
  }, [editorView, canvas, emotionTheme, fireAlertModal]);

  return (
    <div
      css={css`
        position: absolute;
        right: 0;
        bottom: 0;
        padding: 0.5rem;
      `}
    >
      <button
        css={css`
          background: none;
          border: none;
          padding: 0.5rem;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
        `}
        type="button"
        onClick={handleCreateImageButtonClick}
      >
        <Copy
          css={(theme) => css`
            color: ${theme.colors.fg};
            width: 1rem;
          `}
        />
      </button>
    </div>
  );
}
