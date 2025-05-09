import { css } from '@emotion/react';

import { useJudge, useEventJudge, useTestcase, useSetupJudge, useLanguage } from '@/renderer/hooks';

import { TestCaseMaker } from '@/renderer/components/molecules/TestCaseMaker';
import { Testcase } from '@/renderer/components/molecules/Testcase';

import { Tooltip } from 'react-tooltip';

import {
  ExecuteResultTable,
  ExecuteResultThead,
  ExecuteResultTheadRow,
  ExecuteResultHead,
  ExecuteResultTbody,
} from './index.style';

export function OutputContent() {
  const { judgeResults } = useJudge();
  const { language } = useLanguage();
  const { allTestcase, tcKeyMap } = useTestcase();

  useSetupJudge();

  useEventJudge();

  /**
   * 커스텀 테스트케이스의 실제 인덱스를 계산하기 위한 변수
   */
  let j = 0;

  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        padding: 1rem;
        width: 100%;
        gap: 1rem;
      `}
    >
      <Tooltip id="mac-clang-warning" content="실행 시간에 라이브러리 링크 시간이 포함됨" />

      <ExecuteResultTable>
        <ExecuteResultThead>
          <ExecuteResultTheadRow>
            <ExecuteResultHead style={{ width: '30%' }}>예제</ExecuteResultHead>
            <ExecuteResultHead style={{ width: '20%' }}>결과</ExecuteResultHead>
            <ExecuteResultHead style={{ width: '20%' }}>
              시간
              {window.electron.platform === 'darwin' && (language === 'C++14' || language === 'C++17') && (
                <span
                  data-tooltip-id="mac-clang-warning"
                  css={css`
                    margin-left: 0.25rem;
                  `}
                >
                  ⚠️
                </span>
              )}
            </ExecuteResultHead>
            <ExecuteResultHead style={{ width: '15%' }}>상세</ExecuteResultHead>
            <ExecuteResultHead style={{ width: '15%' }}>삭제</ExecuteResultHead>
          </ExecuteResultTheadRow>
        </ExecuteResultThead>
        <ExecuteResultTbody>
          {allTestcase.map((testcase, i) => {
            if (testcase.type === 'problem') {
              j += 1;

              return (
                <Testcase key={tcKeyMap.get(testcase)} judgeResult={judgeResults[i]}>
                  <Testcase.TestcaseTitle num={i + 1} />
                  <Testcase.TestcaseResult />
                  <Testcase.TestcaseElapsed />

                  <Testcase.TestcaseDetail>
                    <Testcase.TestcaseDetail.TestcaseDetailExampleInput initValue={testcase.input}>
                      <Testcase.TestcaseDetail.TestcaseDetailExampleInput.TestcaseDetailExampleCopy />
                    </Testcase.TestcaseDetail.TestcaseDetailExampleInput>

                    <Testcase.TestcaseDetail.TestcaseDetailExampleOuptut initValue={testcase.output}>
                      <Testcase.TestcaseDetail.TestcaseDetailExampleOuptut.TestcaseDetailExampleCopy />
                    </Testcase.TestcaseDetail.TestcaseDetailExampleOuptut>

                    <Testcase.TestcaseDetail.TestcaseDetailResult />
                  </Testcase.TestcaseDetail>
                </Testcase>
              );
            }

            const customTestcaseArrayIdx = i - j;

            return (
              <Testcase key={tcKeyMap.get(testcase)} judgeResult={judgeResults[i]}>
                <Testcase.TestcaseTitle num={customTestcaseArrayIdx + 1} type="custom" />
                <Testcase.TestcaseResult />
                <Testcase.TestcaseElapsed />
                <Testcase.TestcaseDelete idx={customTestcaseArrayIdx} />

                <Testcase.TestcaseDetail>
                  <Testcase.TestcaseDetail.TestcaseDetailExampleInput initValue={testcase.input}>
                    <Testcase.TestcaseDetail.TestcaseDetailExampleInput.TestcaseDetailExampleCopy />
                    <Testcase.TestcaseDetail.TestcaseDetailExampleOuptut.TestcaseDetailExampleEdit
                      idx={customTestcaseArrayIdx}
                    />
                  </Testcase.TestcaseDetail.TestcaseDetailExampleInput>

                  <Testcase.TestcaseDetail.TestcaseDetailExampleOuptut initValue={testcase.output}>
                    <Testcase.TestcaseDetail.TestcaseDetailExampleOuptut.TestcaseDetailExampleCopy />
                    <Testcase.TestcaseDetail.TestcaseDetailExampleOuptut.TestcaseDetailExampleEdit
                      idx={customTestcaseArrayIdx}
                    />
                  </Testcase.TestcaseDetail.TestcaseDetailExampleOuptut>

                  <Testcase.TestcaseDetail.TestcaseDetailResult />
                </Testcase.TestcaseDetail>
              </Testcase>
            );
          })}
        </ExecuteResultTbody>
      </ExecuteResultTable>
      <TestCaseMaker />
    </div>
  );
}
