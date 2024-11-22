import { css } from '@emotion/css';
import { useShallow } from 'zustand/shallow';
import { useStore } from '../../../store';
import { lang2Ext } from '../../../../utils';

export function EditorTitle() {
  const [problem] = useStore(useShallow((s) => [s.problem]));
  const [lang] = useStore(useShallow((s) => [s.lang]));

  return (
    <p
      className={css`
        margin: 0;
        font-size: 0.875rem;
      `}
    >
      {problem && `${problem.number}.${lang2Ext(lang)}`}
    </p>
  );
}
