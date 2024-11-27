/**
 * 언어 선택 모달의 닫힘을 방지하기 위해 div 요소에 e.stopPropagation() 클릭 이벤트를 추가함으로써 발생한 eslint 룰의 비활성화
 */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useState, useEffect, MouseEventHandler } from 'react';
import { useShallow } from 'zustand/shallow';
import { LANGAUGES } from '@/constants';
import { useStore } from '@/renderer/store';
import {
  ToggleLanguageButton,
  ToggleLanguageLayout,
  ToggleLanguageModalBox,
  ToggleLanguageModalItem,
  ToggleLanguageModalItemButton,
  ToggleLanguageModalList,
} from './index.styles';

export function ToggleLanguage() {
  const [langMenuIsOpen, setLangMenuIsOpen] = useState(false);

  const [lang, setLang] = useStore(useShallow((s) => [s.lang, s.setLang]));

  useEffect(() => {
    const handleLangMenuClose = () => {
      setLangMenuIsOpen(false);
    };

    window.addEventListener('click', handleLangMenuClose);

    return () => {
      window.removeEventListener('click', handleLangMenuClose);
    };
  }, []);

  const handleChosenButtonClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    setLangMenuIsOpen(!langMenuIsOpen);

    e.stopPropagation();
  };

  const handleLanguageItemClick =
    (language: Language): MouseEventHandler<HTMLButtonElement> =>
    (e) => {
      setLangMenuIsOpen(false);
      setLang(language);
      e.stopPropagation();
    };

  return (
    <ToggleLanguageLayout>
      <ToggleLanguageButton type="button" onClick={handleChosenButtonClick}>
        {lang}
      </ToggleLanguageButton>

      <ToggleLanguageModalBox onClick={(e) => e.stopPropagation()} isOpen={langMenuIsOpen}>
        <ToggleLanguageModalList>
          {LANGAUGES.map((language) => {
            return (
              <ToggleLanguageModalItem key={language}>
                <ToggleLanguageModalItemButton type="button" onClick={handleLanguageItemClick(language)}>
                  {language}
                </ToggleLanguageModalItemButton>
              </ToggleLanguageModalItem>
            );
          })}
        </ToggleLanguageModalList>
      </ToggleLanguageModalBox>
    </ToggleLanguageLayout>
  );
}
