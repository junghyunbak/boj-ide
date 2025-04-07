/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { css } from '@emotion/react';

import { useStore } from '@/renderer/store';
import { useShallow } from 'zustand/shallow';

import {
  useFetchProblem,
  useModifyLanguage,
  useModifyWebview,
  useModifyHistories,
  useModifyTab,
} from '@/renderer/hooks';

import { languageToExt } from '@/renderer/utils';

import { placeholderLogo } from '@/renderer/assets/base64Images';

import { ReactComponent as Python } from '@/renderer/assets/svgs/python.svg';
import { ReactComponent as JavaScript } from '@/renderer/assets/svgs/js-typo.svg';
import { ReactComponent as Java } from '@/renderer/assets/svgs/java-typo.svg';
import { ReactComponent as Cpp } from '@/renderer/assets/svgs/cpp-typo.svg';

export function SearchModalEditing() {
  const [editorValue] = useStore(useShallow((s) => [s.editorValue]));

  const isExistStalingFile = Object.values(editorValue).some((languages) =>
    Object.values(languages || {}).some((value) => value.cur !== value.prev),
  );

  if (!isExistStalingFile) {
    return null;
  }

  return (
    <div data-testid="editing-problems">
      {Object.entries(editorValue).map(([problemNumber, languages]) => {
        const staleLanguages = Object.entries(languages || {})
          .filter(([language, value]) => value.cur !== value.prev)
          .map(([language, value]) => language) as Language[];

        if (!staleLanguages.length) {
          return null;
        }

        return <EditingProblemItem key={problemNumber} problemNumber={problemNumber} languages={staleLanguages} />;
      })}
    </div>
  );
}

function EditingProblemItem({ problemNumber, languages }: { problemNumber: string; languages: Language[] }) {
  const { tierBase64, title } = useFetchProblem(problemNumber);

  const { updateLanguage } = useModifyLanguage();
  const { gotoProblem } = useModifyWebview();
  const { closeHistoryModal } = useModifyHistories();
  const { addProblemTab } = useModifyTab();

  const handleClickEditingProblem = (language: Language) => () => {
    const problem: ProblemInfo = { name: title, number: problemNumber, testCase: { inputs: [], outputs: [] } };

    gotoProblem(problem);
    addProblemTab(problem);
    updateLanguage(language);
    closeHistoryModal();
  };

  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
      `}
    >
      <div
        css={css`
          display: flex;
          align-items: center;
          gap: 0.5rem;

          padding: 2px 8px;
        `}
      >
        <img
          src={tierBase64 || placeholderLogo}
          css={css`
            width: 0.75rem;
          `}
        />
        <p>{`${problemNumber}번: ${title}`}</p>
      </div>

      <ul
        css={(theme) => css`
          border-left: 1px solid ${theme.colors.border};
          padding: 0 0 0 2px;
          margin: 0 0 0 13px;
        `}
      >
        {languages.map((language) => {
          const Icon = (() => {
            switch (language) {
              case 'C++14':
              case 'C++17':
                return Cpp;
              case 'Java11':
                return Java;
              case 'Python3':
                return Python;
              case 'node.js':
              default:
                return JavaScript;
            }
          })();

          return (
            <li
              key={language}
              css={(theme) => css`
                padding: 2px 4px;

                list-style: none;

                display: flex;
                align-items: center;
                gap: 0.5rem;
                border-radius: 4px;

                cursor: pointer;

                &:hover {
                  background-color: ${theme.colors.hover};
                }
              `}
              onClick={handleClickEditingProblem(language)}
            >
              <div
                css={css`
                  width: 0.75rem;
                  height: 0.75rem;

                  display: flex;
                  justify-content: center;
                  align-items: center;
                `}
              >
                <Icon
                  css={css`
                    width: 100%;
                    height: 100%;
                  `}
                />
              </div>
              <p
                css={css`
                  font-size: 12px;
                `}
              >{`${problemNumber}.${languageToExt(language)}`}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
