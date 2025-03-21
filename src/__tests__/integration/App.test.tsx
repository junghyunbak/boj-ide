import App from '@/renderer/App';
import { act } from 'react';
import { useModifyTab, useModifyWebview } from '@/renderer/hooks';
import { createMockProblem } from '@/renderer/mock';
import { render, screen, renderHook } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

const mockProblem = createMockProblem({
  name: '테스트 문제',
  number: '1000',
});

type ClientChannelToListener = { [channel in ClientChannels]?: (message: ChannelToMessage[channel][Receive]) => void };

const clientChannelToListener: ClientChannelToListener = {};

beforeAll(() => {
  /**
   * get Client Rects 모킹
   */
  const domRectList = [{ x: 0, y: 0, width: 0, height: 0 }] as unknown as DOMRectList;

  Element.prototype.getClientRects = () => domRectList;
  Range.prototype.getClientRects = () => domRectList;

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
   * scrollIntoView 모킹
   */
  window.HTMLElement.prototype.scrollIntoView = jest.fn();

  /**
   * getComputedStyle
   *
   * 이 부분이 제대로 모킹되지 않으면 userEvent가 올바르게 동작하지 않는다.
   *
   * https://github.com/NickColley/jest-axe/issues/147#issuecomment-758804533
   */
  const { getComputedStyle } = window;

  window.getComputedStyle = (elt) => getComputedStyle(elt);

  /**
   * webview 함수 모킹
   */
  const webview = document.createElement('webview');

  webview.loadURL = async () => {};

  /**
   * 테스트를 위한 상태 초기화
   */
  const { result } = renderHook(() => ({ ...useModifyWebview(), ...useModifyTab() }));

  act(() => {
    result.current.addProblemTab(mockProblem);
    result.current.updateWebview(webview);
  });

  /**
   * ipc 모듈 모킹
   */

  window.electron = {
    ipcRenderer: {
      once(channel, func) {},
      on(channel, listener) {
        clientChannelToListener[channel] = listener;

        return () => {};
      },
      sendMessage(channel, message) {},
      invoke(channel, message) {
        return (async () => {
          switch (channel) {
            case 'save-code':
            case 'save-default-code':
              return (async () => ({ data: { isSaved: true } }))();
            case 'load-code':
              return (async () => ({ data: { code: '에디터로딩완료' } }))();
            case 'load-files':
              return (async () => ({ data: { problemNumbers: [] } }))();
            case 'clipboard-copy-image':
            case 'quit-app':
            case 'log-toggle-paint':
            case 'log-execute-ai-create':
            case 'log-add-testcase':
            case 'submit-code':
            case 'open-source-code-folder':
            case 'open-deep-link':
            case 'judge-start':
            default:
              return undefined;
          }
        })();
      },
    },
  };
});

describe('App', () => {
  describe('문제 초기화 이전', () => {
    it('웹 뷰를 통해 문제 페이지로 이동하면 에디터가 활성화 되어야 한다.', () => {});

    it('탭 클릭을 통해 문제 페이지로 이동하면 에디터가 활성화 되어야 한다.', async () => {
      render(<App />);

      const $tabElement = screen.getByText(`${mockProblem.number}번: ${mockProblem.name}`);

      await act(async () => {
        await userEvent.click($tabElement);
      });

      expect(screen.getByText('에디터로딩완료')).toBeInTheDocument();
    });
  });

  describe('문제 초기화 이후', () => {
    beforeEach(async () => {
      render(<App />);

      const $tabElement = screen.getByText(`${mockProblem.number}번: ${mockProblem.name}`);

      await act(async () => {
        await userEvent.click($tabElement);
      });
    });

    describe('내용 수정 이전', () => {
      it('에디터에 키보드로 값을 입력하면, 올바르게 수정되어야 한다.', async () => {
        const $cmEditor = screen.getByTestId('cm-editor');

        await act(async () => {
          await userEvent.type($cmEditor, '내용추가');
        });

        expect(screen.getByText('내용추가에디터로딩완료')).toBeInTheDocument();
      });
    });

    describe('내용 수정 이후', () => {
      beforeEach(async () => {
        const $cmEditor = screen.getByTestId('cm-editor');

        await act(async () => {
          await userEvent.type($cmEditor, '내용추가');
        });
      });

      it('내용이 수정되었을 경우, 코드가 오래된 상태임을 나타내는 UI가 렌더링 되어야한다.', async () => {
        const $staleBall = screen.getByTestId('stale-ball');
        const $saveCodeButton = screen.getByTestId<HTMLButtonElement>('save-code-button');

        expect($saveCodeButton.disabled).toBe(false);
        expect($staleBall).toBeInTheDocument();
      });

      it('F5 단축키로 사용으로 인해 코드가 실행되었을 경우, 코드가 최신 상태임을 나타내는 UI가 렌더링 되어야 한다.', async () => {
        const listener = clientChannelToListener['judge-request'];

        act(() => {
          if (typeof listener === 'function') {
            listener(undefined);
          }
        });

        const $saveCodeButton = screen.getByTestId<HTMLButtonElement>('save-code-button');
        const $staleBall = screen.queryByTestId('stale-ball');

        expect($saveCodeButton.disabled).toBe(true);
        expect($staleBall).not.toBeInTheDocument();
      });
    });
  });
});
