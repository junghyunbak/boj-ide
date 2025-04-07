import App from '@/renderer/App';

import { act } from 'react';

import { render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import {
  useModifyConfirmModal,
  useModifyEditor,
  useModifyLanguage,
  useModifyTab,
  useModifyWebview,
} from '@/renderer/hooks';

import { problemA, problemAData, webview, clientChannelToListener, electronChannelToIsReceived } from '../mocking';

import '../customPolyfill';

import {
  clickProblemTab,
  getConfirmModalText,
  clearProblemEditorValue,
  clickConfirmCancelButton,
  getEditingProblems,
  clickConfirmOkButton,
} from '../testUtil';

// BUG: 언어가 무엇인지에 따라 codemirror 하이라이트로 인해 테스트케이스가 실패할 수 있다.
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
});

beforeEach(() => {
  /**
   * 독립적인 환경에서 테스트하기 위한 전역 상태 초기화
   *
   * 고려할 요소가 너무 많음 -> 개선 필요
   */
  const { result } = renderHook(() => ({
    ...useModifyTab(),
    ...useModifyWebview(),
    ...useModifyLanguage(),
    ...useModifyConfirmModal(),
  }));

  act(() => {
    result.current.updateLanguage(defaultLanguage);
    result.current.addProblemTab(problemA);
    result.current.updateWebview(webview);
    result.current.cancelConfirmModal();
  });

  clearProblemEditorValue(problemA, defaultLanguage);

  Object.keys(electronChannelToIsReceived).forEach((key) => {
    if (electronChannelToIsReceived[key as ElectronChannels]) {
      delete electronChannelToIsReceived[key as ElectronChannels];
    }
  });
});

describe('닫기 동작 테스트', () => {
  describe('ctrl + w 단축키', () => {
    it('문제가 선택되어 있는 경우, 해당 문제의 탭이 닫혀야 한다.', async () => {
      render(<App />);

      await clickProblemTab(problemA);

      expect(screen.getByText(problemAData)).toBeInTheDocument();

      const listeners = clientChannelToListener['close-tab'];

      await act(async () => {
        if (listeners) {
          for (const listener of listeners) {
            await listener({ data: undefined });
          }
        }
      });

      expect(screen.getByText('왼쪽 브라우저에서 문제 페이지로 이동하세요.')).toBeInTheDocument();
    });

    it('문제가 선택되어 있지 않는 경우, 앱 종료 모달이 렌더링되어야 한다.', async () => {
      render(<App />);

      const listeners = clientChannelToListener['close-tab'];

      await act(async () => {
        if (listeners) {
          for (const listener of listeners) {
            await listener({ data: undefined });
          }
        }
      });

      const $confirmModalText = getConfirmModalText();

      expect($confirmModalText).toBeInTheDocument();
      expect($confirmModalText.innerHTML).toBe('종료하시겠습니까?');
    });

    it('문제가 선택되어 있지 않고, 수정중인 파일이 존재할 경우, 경고 메세지가 포함된 앱 종료 모달이 렌더링되어야 한다.', async () => {
      render(<App />);

      const { result } = renderHook(() => useModifyEditor());

      act(() => {
        result.current.updateEditorValue(problemA, defaultLanguage, '텍스트변경');
      });

      const listeners = clientChannelToListener['close-tab'];

      await act(async () => {
        if (listeners) {
          for (const listener of listeners) {
            await listener({ data: undefined });
          }
        }
      });

      const $confirmModalText = getConfirmModalText();

      expect($confirmModalText).toBeInTheDocument();
      expect($confirmModalText.innerHTML).toBe('저장되지 않은 파일이 존재합니다.\n종료하시겠습니까?');
    });
  });

  describe('ctrl + q 단축키 | x 버튼', () => {
    it('수정중인 파일이 없을 경우, 앱이 종료되어야 한다.', async () => {
      render(<App />);

      const listeners = clientChannelToListener['check-saved'];

      await act(async () => {
        if (listeners) {
          for (const listener of listeners) {
            await listener({ data: undefined });
          }
        }
      });

      expect(electronChannelToIsReceived['quit-app']).toBe(true);
    });

    it('수정중인 파일이 존재할 경우, 경고 메세지가 포함된 앱 종료 모달이 렌더링되어야 한다.', async () => {
      render(<App />);

      const { result } = renderHook(() => useModifyEditor());

      act(() => {
        result.current.updateEditorValue(problemA, defaultLanguage, '텍스트변경');
      });

      const listeners = clientChannelToListener['check-saved'];

      await act(async () => {
        if (listeners) {
          for (const listener of listeners) {
            await listener({ data: undefined });
          }
        }
      });

      const $confirmModalText = getConfirmModalText();

      expect($confirmModalText).toBeInTheDocument();
      expect($confirmModalText.innerHTML).toBe('저장되지 않은 파일이 존재합니다.\n종료하시겠습니까?');
    });
  });
});

describe('종료 모달 테스트', () => {
  describe('수정중인 파일이 있을 경우', () => {
    beforeEach(() => {
      const { result } = renderHook(() => useModifyEditor());

      act(() => {
        result.current.updateEditorValue(problemA, defaultLanguage, '텍스트변경');
      });
    });

    it('예 버튼을 누를 경우, 앱이 종료되어야 한다.', async () => {
      render(<App />);

      const listeners = clientChannelToListener['check-saved'];

      await act(async () => {
        if (listeners) {
          for (const listener of listeners) {
            await listener({ data: undefined });
          }
        }
      });

      await clickConfirmOkButton();

      expect(electronChannelToIsReceived['quit-app']).toBe(true);
    });

    it('esc 단축키로 모달을 닫을 경우, 수정중인 파일 목록이 나타나야한다.', async () => {
      render(<App />);

      const listeners = clientChannelToListener['check-saved'];

      await act(async () => {
        if (listeners) {
          for (const listener of listeners) {
            await listener({ data: undefined });
          }
        }
      });

      await act(async () => {
        await userEvent.keyboard('{Escape}');
      });

      expect(getEditingProblems()).toBeInTheDocument();
    });

    it('아니오 버튼으로 모달을 닫을 경우, 수정중인 파일 목록이 나타나야 한다.', async () => {
      render(<App />);

      const listeners = clientChannelToListener['check-saved'];

      await act(async () => {
        if (listeners) {
          for (const listener of listeners) {
            await listener({ data: undefined });
          }
        }
      });

      await clickConfirmCancelButton();

      expect(getEditingProblems()).toBeInTheDocument();
    });
  });
});
