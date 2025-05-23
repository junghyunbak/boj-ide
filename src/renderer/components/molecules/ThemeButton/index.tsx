import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { css } from '@emotion/react';

import { useTheme, useEventClickOutOfModal, useModifyTheme, useEventWindow } from '@/renderer/hooks';

import { SelectButton } from '@/renderer/components/atoms/buttons/SelectButton';
import { NonModal } from '@/renderer/components/atoms/modal/NonModal';
import { ListButton } from '@/renderer/components/atoms/buttons/ListButton';

import { type Themes } from '@/renderer/store/slices/theme';

import { ThemeToKorStr } from '@/renderer/utils';

export function ThemeButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const { theme } = useTheme();

  const THEMES = useMemo<Themes[]>(() => ['baekjoon', 'programmers'], []);

  const { updateTheme } = useModifyTheme();

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  useEventClickOutOfModal(buttonRef, modalRef, closeModal);

  useEventWindow(
    (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    },
    [closeModal],
    'keydown',
  );

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('toggle-theme', {
      data: { theme: theme === 'baekjoon' ? 'light' : 'dark' },
    });
  }, [theme]);

  const handleSelectButtonClick = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleThemeButtonClick = (newTheme: Themes) => {
    return () => {
      window.electron.ipcRenderer.sendMessage('toggle-theme', {
        data: { theme: newTheme === 'baekjoon' ? 'light' : 'dark' },
      });

      updateTheme(newTheme);
      closeModal();
    };
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

      <NonModal ref={modalRef} isOpen={isModalOpen} inset="calc(100% + 2px) 0 auto auto">
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
