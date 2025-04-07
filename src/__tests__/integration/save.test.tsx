import App from '@/renderer/App';

import { act } from 'react';

import { render, screen, renderHook } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import { useModifyLanguage, useModifyTab, useModifyWebview } from '@/renderer/hooks';

import {
  changeProblemData,
  clearEditorState,
  clearProblemEditorValue,
  clickConfirmOkButton,
  clickExecuteCodeButton,
  clickProblemTab,
  clickSaveCodeButton,
  clickSaveDefaultCodeButton,
  clickSubmitCodeButton,
  getStaleBall,
  isSaveButtonDisabled,
  pressKeySWithControl,
  deleteEditorValue,
  typeEditor,
  getEditorCode,
  getEditor,
} from '../testUtil';

import { problemA, problemAData, problemB, problemBData, webview, clientChannelToListener } from '../mocking';

import '../customPolyfill';

const defaultLanguage: Language = 'node.js';

beforeAll(() => {
  /**
   * portal 동작을 위한 dom 추가
   */
  const tourPortalRoot = document.createElement('div');
  tourPortalRoot.id = 'tour';
  document.body.appendChild(tourPortalRoot);

  const afterImagePortalRoot = document.createElement('div');
  afterImagePortalRoot.id = 'after-image';
  document.body.appendChild(afterImagePortalRoot);

  /**
   * 기본 상태 초기화
   */
  const { result } = renderHook(() => ({ ...useModifyWebview(), ...useModifyTab(), ...useModifyLanguage() }));

  act(() => {
    result.current.addProblemTab(problemA);
    result.current.addProblemTab(problemB);
    result.current.updateWebview(webview);
    result.current.updateLanguage(defaultLanguage);
  });
});

beforeEach(() => {
  clearProblemEditorValue(problemA, defaultLanguage);
  clearProblemEditorValue(problemB, defaultLanguage);

  clearEditorState();

  deleteEditorValue(problemA);
  deleteEditorValue(problemB);
});

describe('저장 상태 테스트', () => {
  beforeEach(async () => {
    render(<App />);

    await clickProblemTab(problemA);
  });

  describe('내용 수정 이전', () => {
    describe('수정 이력이 없는 문제로 전환', () => {
      it('기존 문제 상태는 최신 UI, 변경 문제 상태도 최신 UI로 업데이트 되어야 한다.', async () => {
        expect(getStaleBall(problemA)).not.toBeInTheDocument();

        await clickProblemTab(problemB);

        expect(getStaleBall(problemA)).not.toBeInTheDocument();
        expect(getStaleBall(problemB)).not.toBeInTheDocument();
        expect(isSaveButtonDisabled()).toBe(true);
        expect(screen.getByText(problemBData)).toBeInTheDocument();
      });
    });

    describe('수정 이력이 있는 문제로 전환', () => {
      beforeEach(() => {
        changeProblemData(problemB, '수정이력');
      });

      it('기존 문제 상태는 최신 UI, 변경 문제 상태는 편집 UI로 업데이트 되어야 한다.', async () => {
        await clickProblemTab(problemB);

        expect(getStaleBall(problemA)).not.toBeInTheDocument();
        expect(getStaleBall(problemB)).toBeInTheDocument();
        expect(isSaveButtonDisabled()).toBe(false);
        expect(screen.getByText('수정이력')).toBeInTheDocument();
      });
    });
  });

  describe('내용 수정 이후', () => {
    beforeEach(async () => {
      await typeEditor('마지막변경내용');
    });

    it('에디터의 내용이 공백이더라도, 올바르게 저장되어야 한다.', async () => {
      await act(async () => {
        await userEvent.click(getEditor());
        await userEvent.keyboard('{Delete>20/}');
      });

      await clickSaveCodeButton();

      expect(isSaveButtonDisabled()).toBe(true);
      expect(getStaleBall(problemA)).not.toBeInTheDocument();
    });

    it('내용 수정 시, 값이 올바르게 동기화되어야 한다.', () => {
      expect(getEditorCode(problemA)).toBe(`마지막변경내용${problemAData}`);
    });

    it('내용 수정 시, 편집 상태의 UI로 업데이트 되어야 한다.', async () => {
      expect(isSaveButtonDisabled()).toBe(false);
      expect(getStaleBall(problemA)).toBeInTheDocument();
    });

    describe('수정 이력이 없는 문제로 전환', () => {
      beforeEach(() => {
        clearProblemEditorValue(problemB, defaultLanguage);
      });

      it('기존 문제 상태는 편집 UI, 변경 문제 상태는 최신 UI로 업데이트 되어야 한다.', async () => {
        await clickProblemTab(problemB);

        expect(getStaleBall(problemA)).toBeInTheDocument();
        expect(getStaleBall(problemB)).not.toBeInTheDocument();
        expect(screen.getByText(problemBData)).toBeInTheDocument();
        expect(isSaveButtonDisabled()).toBe(true);
      });
    });

    describe('수정 이력이 있는 문제로 전환', () => {
      beforeEach(() => {
        changeProblemData(problemB, '수정이력');
      });

      it('기존 문제 상태는 편집 UI, 변경 문제 상태도 편집 UI로 업데이트 되어야 한다.', async () => {
        await clickProblemTab(problemB);

        expect(getStaleBall(problemA)).toBeInTheDocument();
        expect(getStaleBall(problemB)).toBeInTheDocument();
        expect(isSaveButtonDisabled()).toBe(false);
        expect(screen.getByText('수정이력')).toBeInTheDocument();
      });
    });

    describe('의도적인 코드 저장', () => {
      // BUG: vim 모드에서 userEvent.click이 동작하지 않는 문제 존재
      it('vim 모드에서 :w 명령어 입력 시, 코드가 최신 상태임을 알리는 UI가 렌더링 되어야 한다.', async () => {});

      // BUG: meta + s의 경우 ctrl + s와 다르게 키보드 입력 또한 발생
      it('cmd + s 단축키 사용시, 최신 상태의 UI로 업데이트 되어야 한다.', async () => {});

      it('control + s 단축키 사용시, 최신 상태의 UI로 업데이트 되어야 한다.', async () => {
        await pressKeySWithControl();

        expect(isSaveButtonDisabled()).toBe(true);
        expect(getStaleBall(problemA)).not.toBeInTheDocument();
      });

      it('코드 저장 버튼 클릭 시, 최신 상태의 UI로 업데이트 되어야 한다.', async () => {
        await clickSaveCodeButton();

        expect(isSaveButtonDisabled()).toBe(true);
        expect(getStaleBall(problemA)).not.toBeInTheDocument();
      });
    });

    describe('의도적이지 않은 코드 저장', () => {
      it('기본 코드로 저장 버튼 클릭 시, 최신 상태의 UI로 업데이트 되어야 한다.', async () => {
        await clickSaveDefaultCodeButton();
        await clickConfirmOkButton();

        expect(isSaveButtonDisabled()).toBe(true);
        expect(getStaleBall(problemA)).not.toBeInTheDocument();
      });

      it('코드 제출 버튼 클릭 시, 최신 상태의 UI로 업데이트 되어야 한다.', async () => {
        await clickSubmitCodeButton();
        await clickConfirmOkButton();

        expect(isSaveButtonDisabled()).toBe(true);
        expect(getStaleBall(problemA)).not.toBeInTheDocument();
      });

      it('코드 실행 버튼 클릭 시, 최신 상태의 UI로 업데이트 되어야 한다.', async () => {
        await clickExecuteCodeButton();

        expect(isSaveButtonDisabled()).toBe(true);
        expect(getStaleBall(problemA)).not.toBeInTheDocument();
      });

      it('F5 단축키로 코드 실행 시, 코드가 최신 상태임을 나타내는 UI가 렌더링 되어야 한다.', async () => {
        await act(async () => {
          const listeners = clientChannelToListener['judge-request'];

          if (listeners) {
            for (const listener of listeners) {
              await listener({ data: undefined });
            }
          }
        });

        expect(isSaveButtonDisabled()).toBe(true);
        expect(getStaleBall(problemA)).not.toBeInTheDocument();
      });
    });
  });
});

// TEST: 방문 기록 모달에서, 수정중인 문제&언어로 이동했을 경우, 문제 & 언어 정보가 올바르게 초기화되어야 한다. (testcase & inputDesc)

// 수정중인 파일이 존재하는 경우
// TEST: 방문 기록 모달 내에 수정중인 파일이 존재해야한다.
