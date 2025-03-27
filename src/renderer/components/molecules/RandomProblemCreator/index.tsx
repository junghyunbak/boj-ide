import { useCallback, useRef, useState } from 'react';
import { Range } from 'react-range';

import { css, useTheme } from '@emotion/react';

import { useEventClickOutOfModal, useEventWindow } from '@/renderer/hooks';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { ReactComponent as Badge } from '@/renderer/assets/svgs/solvedac-badge.svg';
import { ReactComponent as Dice } from '@/renderer/assets/svgs/dice.svg';

import { NonModal } from '../../atoms/modal/NonModal';
import { TextInput } from '../../atoms/inputs/TextInput';
import { ActionButton } from '../../atoms/buttons/ActionButton';

function tierToColor(tier: number) {
  if (tier === 0) {
    return '#2d2d2d';
  } else if (1 <= tier && tier <= 5) {
    return '#ad5601';
  } else if (6 <= tier && tier <= 10) {
    return '#435f7a';
  } else if (11 <= tier && tier <= 15) {
    return '#ec9a00';
  } else if (16 <= tier && tier <= 20) {
    return '#2ae2a4';
  } else if (21 <= tier && tier <= 25) {
    return '#00b4fc';
  } else if (26 <= tier && tier <= 30) {
    return '#ff0062';
  } else {
    return '#abacff';
  }
}

const STEP = 1;
const MIN_TIER = 1;
const MAX_TIER = 31;

export function RandomProblemCreator() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const emotionTheme = useTheme();

  const [tierValues, setTierValues] = useStore(useShallow((s) => [s.tierValues, s.setTierValues]));
  const [baekjoonId, setBaekjoonId] = useStore(useShallow((s) => [s.baekjoonId, s.setBaekjoonId]));

  useEventWindow(
    (e) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false);
      }
    },
    [],
    'keydown',
  );

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  useEventClickOutOfModal(buttonRef, modalRef, closeModal);

  return (
    <div
      css={css`
        position: relative;
      `}
    >
      <button
        type="button"
        onClick={() => setIsModalOpen(!isModalOpen)}
        ref={buttonRef}
        css={(theme) => css`
          color: ${theme.colors.fg};
          padding: 0.25rem;
          margin: 0;
          background: none;
          border: none;

          display: flex;
          justify-content: center;
          align-items: center;

          border-radius: 4px;

          cursor: pointer;
          &:hover {
            background-color: ${theme.colors.active};
          }
        `}
      >
        <Dice
          css={css`
            width: 1rem;
          `}
        />
      </button>

      <NonModal isOpen={isModalOpen} inset="calc(100% + 2px) 0 auto auto" ref={modalRef}>
        <div
          css={css`
            padding: 1rem;
            display: flex;
            flex-direction: column;
            gap: 1rem;
          `}
        >
          <TextInput
            value={baekjoonId}
            onChange={(e) => setBaekjoonId(e.target.value)}
            placeholder="유저 `jeong5728`이 풀지 않은 문제 검색"
          />

          <div
            css={css`
              width: 300px;
            `}
          >
            <Range
              values={tierValues}
              step={STEP}
              min={MIN_TIER}
              max={MAX_TIER}
              onChange={setTierValues}
              renderTrack={({ props, children }) => {
                const { onMouseDown, ref, style } = props;

                const background = (() => {
                  const [s, e] = tierValues;

                  const totalTierCount = MAX_TIER - MIN_TIER + 1;

                  const startPercent = (s / totalTierCount) * 100;
                  const endPercent = (e / totalTierCount) * 100;

                  const startColor = tierToColor(s);
                  const endColor = tierToColor(e);

                  return `linear-gradient(to right, ${emotionTheme.colors.border} 0%, ${emotionTheme.colors.border} ${startPercent}%, ${startColor} ${startPercent}%, ${endColor} ${endPercent}%, ${emotionTheme.colors.border} ${endPercent}%, ${emotionTheme.colors.border} 100%)`;
                })();

                return (
                  <div
                    onMouseDown={onMouseDown}
                    css={css`
                      display: flex;
                      align-items: center;

                      width: 100%;
                      height: 30px;

                      padding: 0 12px;
                    `}
                  >
                    <div
                      ref={ref}
                      css={css`
                        width: 100%;
                        height: 5px;
                        background: ${background};
                      `}
                    >
                      {children}
                    </div>
                  </div>
                );
              }}
              renderThumb={({ props, isDragged }) => {
                const { key, style } = props;

                const tier = tierValues[key];

                const color = tierToColor(tier);

                const count = (() => {
                  return 6 - (((tier - 1) % 5) + 1);
                })();

                return (
                  <div
                    {...props}
                    key={key}
                    css={css`
                      color: ${color};

                      outline: none;

                      width: 24px;
                      height: 24px;

                      display: flex;
                      justify-content: center;
                      align-items: center;

                      position: relative;
                    `}
                  >
                    <Badge
                      css={css`
                        position: absolute;
                        top: 0;

                        width: 100%;
                        height: 100%;
                      `}
                    />

                    <p
                      css={css`
                        position: absolute;
                        top: -1px;

                        color: white;
                        font-weight: bold;
                        font-size: 14px;
                      `}
                    >
                      {count}
                    </p>
                  </div>
                );
              }}
            />
          </div>

          <ActionButton>랜덤 문제 생성</ActionButton>
        </div>
      </NonModal>
    </div>
  );
}
