import { css } from '@emotion/css';
import { useState } from 'react';
import { useStore } from '../../../store';
import { useShallow } from 'zustand/shallow';
import { color } from '../../../../styles';

interface TestCaseProps {
  problem: ProblemInfo;
  index: number;
  input: string;
  output: string;
  isJudging: boolean;
  judgeResult?: JudgeResult;
  type: TC['type'];
}

export function TestCase({ problem, isJudging, index, input, output, judgeResult, type }: TestCaseProps) {
  const [isOpen, setIsOpen] = useState(false);

  const [removeCustomTestCase] = useStore(useShallow((s) => [s.removeCustomTestCase]));

  const resultColor = (() => {
    switch (judgeResult?.result) {
      case '런타임 에러':
        return color.error;
      case '맞았습니다!!':
        return color.correct;
      case '시간 초과':
        return color.over;
      case '틀렸습니다':
        return color.wrong;
      default:
        return color.text;
    }
  })();

  return (
    <div
      className={css`
        width: 100%;
      `}
    >
      <li
        className={css`
          list-style: none;
        `}
      >
        <button
          type="button"
          className={css`
            width: 100%;
            padding: 1rem 1rem 0 1rem;
            border: none;
            background: transparent;
            text-align: start;
            cursor: pointer;
            font-size: 1rem;
            display: flex;
            align-items: center;

            &::before {
              content: '';
              display: inline-block;
              width: 0;
              height: 0;
              border-top: 5px solid transparent;
              border-bottom: 5px solid transparent;

              margin-right: 0.4rem;

              border-left: 5px solid black;

              transform: rotate(${isOpen ? '90deg' : '0'});
              transition: transform ease 0.2s;
            }
          `}
          onClick={() => setIsOpen(!isOpen)}
        >
          {type === 'custom' ? '사용자' : ''} 예제 입력{' '}
          {index + 1 - (type === 'custom' ? problem.testCase.inputs.length : 0)}{' '}
          {isJudging && !judgeResult && (
            <span
              className={css`
                color: gray;
                margin-left: 0.5rem;
              `}
            >
              채점중...
            </span>
          )}
          {judgeResult && (
            <span
              className={css`
                color: ${resultColor};
                font-weight: 700;
                margin-left: 0.5rem;
              `}
            >
              {judgeResult.result}
            </span>
          )}
          {type === 'custom' && (
            <div
              className={css`
                display: flex;
                margin-left: 0.5rem;
                border: 2px solid red;
                border-radius: 9999px;
                width: 1rem;
                height: 1rem;
                justify-content: center;
                align-items: center;
              `}
              onClick={(e) => {
                removeCustomTestCase(problem.number, index - problem.testCase.inputs.length);

                e.stopPropagation();
              }}
            >
              <div
                className={css`
                  width: 80%;
                  border-bottom: 2px solid red;
                `}
              />
            </div>
          )}
        </button>

        {isOpen && (
          <div
            className={css`
              padding: 1rem;
            `}
          >
            <div
              className={css`
                display: flex;
                gap: 0.5rem;

                pre {
                  background-color: #f7f7f9;

                  border: 1px solid lightgray;

                  overflow-x: scroll;

                  font-size: 18px;
                  font-family: 'menlo';
                  line-height: 1.4;
                }
              `}
            >
              <pre
                style={{
                  width: '50%',
                  padding: '8px',
                }}
              >
                {input}
              </pre>
              <pre
                style={{
                  width: '50%',
                  padding: '8px',
                }}
              >
                {output}
              </pre>
            </div>

            {judgeResult && (
              <table
                className={css`
                  tr {
                    td:first-of-type {
                      white-space: nowrap;
                      text-align: right;
                      vertical-align: top;

                      color: gray;

                      &::after {
                        content: '>';
                        padding: 0 0.5rem;
                      }
                    }
                  }

                  pre {
                    margin: 0;
                    font-size: 1rem;
                    white-space: pre-wrap;
                  }
                `}
              >
                <tbody>
                  <tr>
                    <td>결과</td>

                    <td
                      className={css`
                        color: ${resultColor};
                        font-weight: 700;
                      `}
                    >
                      {judgeResult?.result}
                    </td>
                  </tr>

                  <tr>
                    <td>실행 시간</td>
                    <td>{`${judgeResult?.elapsed}ms`}</td>
                  </tr>

                  <tr>
                    <td>출력</td>

                    <td>
                      <pre>{judgeResult?.stdout}</pre>
                    </td>
                  </tr>

                  {judgeResult?.stderr && (
                    <tr>
                      <td>에러</td>

                      <td>
                        <pre>{judgeResult.stderr}</pre>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        )}
      </li>
    </div>
  );
}
