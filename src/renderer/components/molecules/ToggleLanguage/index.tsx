import { useCallback, useRef, useState } from 'react';

import { css } from '@emotion/react';

import { LANGAUGES } from '@/renderer/constants';

import { useEventClickOutOfModal, useEventWindow, useLanguage, useModifyLanguage } from '@/renderer/hooks';

import { NonModal } from '@/renderer/components/atoms/modal/NonModal';
import { SelectButton } from '@/renderer/components/atoms/buttons/SelectButton';
import { ListButton } from '@/renderer/components/atoms/buttons/ListButton';

export function ToggleLanguage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const { language } = useLanguage();
  const { updateLanguage } = useModifyLanguage();

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  useEventClickOutOfModal(buttonRef, modalRef, closeModal);

  useEventWindow(
    (e) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false);
      }
    },
    [],
    'keydown',
  );

  const handleSelectClick = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleOptionClick = (langugae: Language) => () => {
    updateLanguage(langugae);
    closeModal();
  };

  return (
    <div
      css={css`
        position: relative;
      `}
    >
      <SelectButton ref={buttonRef} isActive={isModalOpen} onClick={handleSelectClick}>
        {language}
      </SelectButton>

      <NonModal ref={modalRef} isOpen={isModalOpen} inset="calc(100% + 2px) 0 auto auto">
        <div
          css={css`
            padding: 0.25rem 0;
          `}
        >
          {LANGAUGES.map((LANGUAGE) => {
            return (
              <ListButton key={LANGUAGE} onClick={handleOptionClick(LANGUAGE)}>
                {LANGUAGE}
              </ListButton>
            );
          })}
        </div>
      </NonModal>
    </div>
  );
}
