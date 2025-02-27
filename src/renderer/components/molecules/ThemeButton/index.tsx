import { useCallback, useState } from 'react';

import { css } from '@emotion/react';

import { useTheme, useClickOutOfModal } from '@/renderer/hooks';

import { SelectButton } from '@/renderer/components/atoms/buttons/SelectButton';
import { NonModal } from '@/renderer/components/atoms/modal/NonModal';
import { ListButton } from '@/renderer/components/atoms/buttons/ListButton';

import { type Themes } from '@/renderer/store/slices/theme';

const THEMES: Themes[] = ['baekjoon', 'programmers'];

const ThemeToKorStr = (theme: Themes) => {
  switch (theme) {
    case 'baekjoon':
      return '백준';
    case 'programmers':
      return '프로그래머스';

    default:
      return '';
  }
};

export function ThemeButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { theme, updateTheme } = useTheme();

  const { buttonRef, modalRef } = useClickOutOfModal(() => {
    setIsModalOpen(false);
  });

  const handleSelectButtonClick = useCallback(() => {
    setIsModalOpen(!isModalOpen);
  }, [setIsModalOpen, isModalOpen]);

  const handleThemeButtonClick = (newTheme: Themes) => () => {
    updateTheme(newTheme);
    setIsModalOpen(false);
  };

  return (
    <div
      css={css`
        position: relative;
      `}
    >
      <SelectButton ref={buttonRef} onClick={handleSelectButtonClick} isActive={isModalOpen}>
        {`현재 테마: ${ThemeToKorStr(theme)}`}
      </SelectButton>

      <NonModal ref={modalRef} isOpen={isModalOpen} inset="100% 0 auto auto">
        <div
          css={css`
            padding: 0.25rem 0;
          `}
        >
          {THEMES.map((_theme) => (
            <ListButton key={_theme} onClick={handleThemeButtonClick(_theme)}>
              {ThemeToKorStr(_theme)}
            </ListButton>
          ))}
        </div>
      </NonModal>
    </div>
  );
}
