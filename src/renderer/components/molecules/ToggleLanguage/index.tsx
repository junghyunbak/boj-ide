import { useCallback, useRef, useState } from 'react';

import { css } from '@emotion/react';

import { LANGAUGES } from '@/renderer/constants';

import { useEditor, useEventClickOutOfModal, useModifyEditor } from '@/renderer/hooks';

import { NonModal } from '@/renderer/components/atoms/modal/NonModal';
import { SelectButton } from '@/renderer/components/atoms/buttons/SelectButton';
import { ListButton } from '@/renderer/components/atoms/buttons/ListButton';

export function ToggleLanguage() {
  const { editorLanguage } = useEditor();

  const { updateEditorLanguage } = useModifyEditor();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  useEventClickOutOfModal(buttonRef, modalRef, closeModal);

  const handleSelectClick = useCallback(() => {
    setIsModalOpen(!isModalOpen);
  }, [isModalOpen]);

  const handleOptionClick = useCallback(
    (langugae: Language) => {
      return () => {
        updateEditorLanguage(langugae);
        closeModal();
      };
    },
    [closeModal, updateEditorLanguage],
  );

  return (
    <div
      css={css`
        position: relative;
      `}
    >
      <SelectButton ref={buttonRef} isActive={isModalOpen} onClick={handleSelectClick}>
        {editorLanguage}
      </SelectButton>

      <NonModal ref={modalRef} isOpen={isModalOpen} inset="100% 0 auto auto">
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
