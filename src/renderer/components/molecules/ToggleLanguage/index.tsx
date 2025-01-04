import { useState } from 'react';
import { css } from '@emotion/react';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import { LANGAUGES } from '@/renderer/constants';

import { useClickOutOfModal } from '@/renderer/hooks';

import { NonModal } from '@/renderer/components/atoms/modal/NonModal';
import { SelectButton } from '@/renderer/components/atoms/buttons/SelectButton';
import { ListButton } from '@/renderer/components/atoms/buttons/ListButton';

// [ ]: 언어를 고르면 텍스트가 해당 언어로 변경된다.
export function ToggleLanguage() {
  const [lang, setLang] = useStore(useShallow((s) => [s.lang, s.setLang]));

  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);

  const { buttonRef, modalRef } = useClickOutOfModal(() => {
    setIsLanguageModalOpen(false);
  });

  const handleToggleButtonClick = () => {
    setIsLanguageModalOpen(!isLanguageModalOpen);
  };

  const handleLanguageButtonClick = (language: Language) => () => {
    setLang(language);
    setIsLanguageModalOpen(false);
  };

  return (
    <div
      css={css`
        position: relative;
      `}
    >
      <SelectButton ref={buttonRef} isActive={isLanguageModalOpen} onClick={handleToggleButtonClick}>
        {lang}
      </SelectButton>

      <NonModal ref={modalRef} isOpen={isLanguageModalOpen} inset="100% 0 auto auto">
        {LANGAUGES.map((LANGUAGE) => {
          return (
            <ListButton key={LANGUAGE} onClick={handleLanguageButtonClick(LANGUAGE)}>
              {LANGUAGE}
            </ListButton>
          );
        })}
      </NonModal>
    </div>
  );
}
