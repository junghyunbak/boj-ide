import { css } from '@emotion/css';
import { useState } from 'react';
import { useShallow } from 'zustand/shallow';
import { useStore } from '../../../store';
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
    if (judgeResult) {
      switch (judgeResult.result) {
        case '런타임 에러':
          return color.error;
        case '맞았습니다!!':
          return color.correct;
        case '시간 초과':
        case '출력 초과':
          return color.over;
        case '틀렸습니다':
          return color.wrong;
        default:
          return color.text;
      }
    }

    if (isJudging) {
      return color.judging;
    }

    return color.text;
  })();

  const status = (() => {
    if (judgeResult) {
      return judgeResult.result;
    }

    if (isJudging) {
      return '채점 중';
    }

    return '';
  })();

  return (
    <>
      <tr>
        <td>
          {`${type === 'custom' ? '사용자' : ''} 예제 입력 ${index + 1 - (type === 'custom' ? problem.testCase.inputs.length : 0)}`}
        </td>
        <td>
          <p
            className={css`
              color: ${resultColor};
              margin: 0;
              font-weight: bold;
            `}
          >
            {status}
          </p>
        </td>
        <td>
          {judgeResult && (
            <p
              className={css`
                margin: 0;

                span {
                  color: #e74c3c;
                }
              `}
            >
              {judgeResult.elapsed} <span>ms</span>
            </p>
          )}
        </td>
        <td>
          <button
            type="button"
            className={css`
              border: none;
              background: none;
              color: ${color.primaryText};
              cursor: pointer;
              padding: 0;
              &:hover {
                text-decoration: underline;
              }
            `}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? '접기' : '열기'}
          </button>
        </td>
        <td>
          {type === 'custom' && (
            <button
              type="button"
              className={css`
                border: none;
                background: none;
                color: ${color.primaryText};
                cursor: pointer;
                padding: 0;
                &:hover {
                  text-decoration: underline;
                }
              `}
              onClick={(e) => {
                removeCustomTestCase(problem.number, index - problem.testCase.inputs.length);

                e.stopPropagation();
              }}
            >
              삭제
            </button>
          )}
        </td>
      </tr>
      <tr>
        <td colSpan={5}>
          {isOpen && (
            <div
              className={css`
                border-top: 1px solid #ddd;
                padding: 0.5rem;
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
                align-items: start;
              `}
            >
              <div
                className={css`
                  display: flex;
                  gap: 0.5rem;
                  width: 100%;

                  pre {
                    margin: 0;

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
                      white-space: pre-wrap;
                      font-family: open-sans;
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
        </td>
      </tr>
    </>
  );
}
