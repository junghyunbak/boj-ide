import { useState, useEffect } from 'react';
import { css } from '@emotion/css';
import { useShallow } from 'zustand/shallow';
import { LANGAUGES } from '../../../../constants';
import { useStore } from '../../../store';

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

  return (
    <div
      className={css`
        display: flex;
        position: relative;
        z-index: 10;
      `}
    >
      <button
        type="button"
        onClick={(e) => {
          setLangMenuIsOpen(!langMenuIsOpen);

          e.stopPropagation();
        }}
        className={css`
          border: none;
          background: lightgray;
          color: white;
          padding: 0.4rem 0.8rem;
          cursor: pointer;
          white-space: nowrap;
          font-weight: 500;

          &::after {
            content: '';
            display: inline-block;
            margin-left: 0.255em;
            vertical-align: 0.255em;
            border-top: 0.3em solid;
            border-right: 0.3em solid transparent;
            border-left: 0.3em solid transparent;
          }
        `}
      >
        {lang}
      </button>

      {langMenuIsOpen && (
        <div
          className={css`
            position: absolute;
            top: 100%;
            right: 0;
            background-color: white;
            overflow: hidden;
            box-shadow: 1px 1px 1px 1px rgb(0, 0, 0, 0.2);

            > div {
              padding: 0.5rem;
              margin: 0;

              button {
                text-align: left;
                font-size: 0.8rem;
                padding: 0.2rem 0.4rem;
                cursor: pointer;
                border: none;
                background-color: transparent;
              }
            }
          `}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div>
            {LANGAUGES.map((language) => {
              return (
                <button
                  key={language}
                  type="button"
                  onClick={(e) => {
                    setLangMenuIsOpen(false);
                    setLang(language);
                    e.stopPropagation();
                  }}
                >
                  {language}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
