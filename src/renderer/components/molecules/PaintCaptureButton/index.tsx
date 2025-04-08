import { useCallback } from 'react';

import { useTheme, css } from '@emotion/react';

import { useModifyAlertModal, useModifyToast, usePaint } from '@/renderer/hooks';

import { fabric } from 'fabric';

import { ReactComponent as Copy } from '@/renderer/assets/svgs/copy.svg';

const MIN_PADDING = 25;

export function PaintCaptureButton() {
  const { canvas, paintRef } = usePaint();
  const { fireToast } = useModifyToast();
  const { fireAlertModal } = useModifyAlertModal();

  const emotionTheme = useTheme();

  // TODO: useModifyPaint 커스텀 훅으로 로직 분리
  const handleCreateImageButtonClick = useCallback(async () => {
    if (!canvas) {
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
      const { top, left, height, width, scaleX, scaleY } = obj;

      if (
        top === undefined ||
        left === undefined ||
        width === undefined ||
        height === undefined ||
        scaleX === undefined ||
        scaleY === undefined
      ) {
        return;
      }

      const realWidth = width * scaleX;
      const realHeight = height * scaleY;

      mil = Math.min(mil, left);
      mit = Math.min(mit, top);
      mar = Math.max(mar, left + realWidth);
      mab = Math.max(mab, top + realHeight);
    });

    const paddingX = Math.max((mar - mil) * 0.1, MIN_PADDING);
    const paddingY = Math.max((mab - mit) * 0.1, MIN_PADDING);

    const width = mar - mil + paddingX * 2;
    const height = mab - mit + paddingY * 2;

    if (width === Infinity || height === Infinity) {
      fireAlertModal('오류', '그림을 저장하는 중 문제가 발생했습니다.');
      return;
    }

    const mainCanvas = new fabric.Canvas('mainCanvas', { backgroundColor: emotionTheme.colors.bg, width, height });

    const addObjectToMainCanvas = (obj: fabric.Object) => {
      return new Promise((resolve) => {
        obj.clone((cloneObj: fabric.Object) => {
          const { left, top } = cloneObj;

          if (left !== undefined && top !== undefined) {
            mainCanvas.add(
              cloneObj.set({
                left: left - mil + paddingX,
                top: top - mit + paddingY,
              }),
            );
          }

          resolve(true);
        });
      });
    };

    const WATERMARK_PADDING = paddingY * 0.1;

    const waterMarkText = new fabric.Text('BOJ IDE', {
      fontSize: paddingY - WATERMARK_PADDING * 2,
      lineHeight: 1,
      fontFamily: 'helvetica-neue',
      fontWeight: 500,
      fill: emotionTheme.colors.disabledFg,
    });

    waterMarkText.left = mil - paddingX + WATERMARK_PADDING;
    waterMarkText.top = mit - paddingY + WATERMARK_PADDING;

    await addObjectToMainCanvas(waterMarkText);

    for (const obj of canvasObjects) {
      await addObjectToMainCanvas(obj);
    }

    const result = await window.electron.ipcRenderer.invoke('clipboard-copy-image', {
      data: { dataUrl: mainCanvas.toDataURL({ format: 'png' }) },
    });

    if (result && result.data.isSaved) {
      fireToast({ message: '클립보드 복사 완료 ✅', time: 2000 });
    }
  }, [canvas, emotionTheme, fireAlertModal, fireToast]);

  const handleButtonMouseDown: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    /**
     * 버튼 클릭으로 인한 fabric canvas의 focus blur를 방지
     */
    e.preventDefault();

    paintRef.current?.focus();
  };

  return (
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
      onMouseDown={handleButtonMouseDown}
    >
      <Copy
        css={(theme) => css`
          color: ${theme.colors.fg};
          width: 1rem;
        `}
      />
    </button>
  );
}
