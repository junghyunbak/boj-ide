import { useFetchSolvedACProblemData } from '@/renderer/hooks/api';
import { color } from '@/styles';
import { css } from '@emotion/react';

interface SubmitListItemProps {
  problemNumber: string;
  gage: number;
  resultText: string;
  language: Language;
}

export function SubmitListItem({ problemNumber, gage, resultText, language }: SubmitListItemProps) {
  const { TierImg, title } = useFetchSolvedACProblemData(problemNumber);

  const resultTextColor = (() => {
    if (/'기다리는 중'/.test(resultText)) {
      return '#a49e9e';
    }

    if (/맞았습니다!!/.test(resultText)) {
      return color.correct;
    }

    if (/틀렸습니다/.test(resultText)) {
      return color.wrong;
    }

    if (/채점 중/.test(resultText)) {
      return '#e67e22';
    }

    if (/초과/.test(resultText) || /출력 형식이/.test(resultText)) {
      return '#fa7268';
    }

    if (/[0-9]+점/.test(resultText)) {
      return '#efc050';
    }

    if (/런타임 에러/.test(resultText)) {
      return '#5f4b8b';
    }

    if (/컴파일 에러/.test(resultText)) {
      return '#0f4c81';
    }

    return 'black';
  })();

  return (
    <tr>
      <td>
        <div
          css={css`
            display: flex;
            gap: 0.25rem;
          `}
        >
          <div
            css={css`
              width: 12px;
              flex-shrink: 0;
            `}
          >
            {TierImg}
          </div>
          <p
            css={css`
              margin: 0;
              font-size: 0.875rem;
            `}
          >{`${problemNumber}번: ${title}`}</p>
        </div>
      </td>

      <td>
        <p
          css={css`
            margin: 0;
            font-size: 0.875rem;
          `}
        >
          {language}
        </p>
      </td>

      <td>
        <div
          css={css`
            display: flex;
            flex-direction: column;
          `}
        >
          <p
            css={css`
              margin: 0;
              font-size: 0.75rem;
            `}
          >
            {gage >= 0 ? `${gage.toFixed(0)}%` : '에러 발생'}
          </p>

          <div
            css={css`
              width: 100%;
              height: 8px;
              border-radius: 0.25rem;
              overflow: hidden;
              background-color: lightgray;
            `}
          >
            <div
              css={css`
                width: ${gage}%;
                height: 100%;
                background-color: ${gage >= 0 ? color.primaryBg : color.wrong};
              `}
            />
          </div>
        </div>
      </td>
      <td>
        <p
          css={css`
            font-size: 0.875rem;
            color: ${resultTextColor};
            font-weight: bold;
            margin: 0;
          `}
        >
          {resultText}
        </p>
      </td>
    </tr>
  );
}
