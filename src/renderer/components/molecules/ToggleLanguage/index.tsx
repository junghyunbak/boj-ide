import { useState } from 'react';
import { SelectButton } from '@/renderer/components/atoms/buttons/SelectButton';
import { css } from '@emotion/react';
import { LANGAUGES } from '@/constants';
import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';
import { NonModal } from '@/renderer/components/atoms/modal/NonModal';
import { ListButton } from '@/renderer/components/atoms/buttons/ListButton';
import { useClickOutOfModal } from '@/renderer/hooks';

// 테스트
// [ ]: 언어를 고르면 텍스트가 해당 언어로 변경된다.
export function ToggleLanguage() {
  const [language, setLanguage] = useStore(useShallow((s) => [s.lang, s.setLang]));

  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);

  const { buttonRef, modalRef } = useClickOutOfModal(() => {
    setIsLanguageModalOpen(false);
  });

  const handleToggleButtonClick = () => {
    setIsLanguageModalOpen(!isLanguageModalOpen);
  };

  const handleLanguageButtonClick = (language: Language) => () => {
    setLanguage(language);
    setIsLanguageModalOpen(false);
  };

  return (
    <div
      css={css`
        // [ ]: relative 요소로 인해 resizer bar 위로 겹치는 이슈 존재
        position: relative;
      `}
    >
      <SelectButton ref={buttonRef} isActive={isLanguageModalOpen} onClick={handleToggleButtonClick}>
        {language}
      </SelectButton>

      <NonModal ref={modalRef} isOpen={isLanguageModalOpen} inset="100% 0 auto auto">
        {LANGAUGES.map((language) => {
          return (
            <ListButton key={language} onClick={handleLanguageButtonClick(language)}>
              {language}
            </ListButton>
          );
        })}
      </NonModal>
    </div>
  );
}
