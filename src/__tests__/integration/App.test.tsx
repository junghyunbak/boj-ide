import App from '@/renderer/App';
import { act } from 'react';
import { useModifyEditor, useModifyTab, useModifyWebview } from '@/renderer/hooks';
import { createMockProblem } from '@/renderer/mock';
import { render, screen, renderHook } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import '@testing-library/jest-dom';

const mockProblem = createMockProblem({
  name: '테스트 문제',
  number: '1000',
});

type ClientChannelToListener = {
  [channel in ClientChannels]?: (message: ChannelToMessage[channel][Receive]) => void | Promise<void>;
};

const clientChannelToListener: ClientChannelToListener = {};

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

beforeAll(() => {
  /**
   * document api mocking
   */
  document.elementFromPoint = jest.fn().mockImplementation((x, y) => null);

  const domRectList = [{ x: 0, y: 0, width: 0, height: 0 }] as unknown as DOMRectList;

  Element.prototype.getClientRects = () => domRectList;
  Range.prototype.getClientRects = () => domRectList;

  window.HTMLElement.prototype.scrollIntoView = jest.fn();

  /**
   * api mocking
   */
  mockedAxios.get.mockResolvedValue({ data: {} });

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
      async invoke(channel, message) {
        switch (channel) {
          case 'save-code':
            return { data: { isSaved: true } };
          case 'save-default-code':
            return { data: { isSaved: true } };
          case 'load-code':
            return { data: { code: '에디터로딩완료' } };
          case 'load-files':
            return { data: { problemNumbers: [] } };
          case 'clipboard-copy-image':
            return { data: { isSaved: true } };
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
      },
    },
  };
});

describe('App', () => {
  describe('문제 초기화 이전', () => {
    it('저장 버튼이 클릭할 수 없는 상태여야 한다.', () => {});

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

      describe('의도적인 코드 저장', () => {
        // BUG: vim 모드에서 userEvent.click이 동작하지 않는 문제 존재.
        it('vim 모드에서 :w 명령어 입력 시, 코드가 최신 상태임을 알리는 UI가 렌더링 되어야 한다.', async () => {
          /*
          const { result } = renderHook(() => useModifyEditor());

          act(() => {
            result.current.updateEditorMode('vim');
          });

          const $cmEditor = screen.getByTestId('cm-editor');

          const user = userEvent.setup();

          await act(async () => {
            await user.click($cmEditor);
            await user.keyboard('{Shift>}{;}{/Shift}w{Enter}');
          });

          const $saveCodeButton = screen.getByTestId<HTMLButtonElement>('save-code-button');
          const $staleBall = screen.queryByTestId('stale-ball');

          expect($saveCodeButton.disabled).toBe(true);
          expect($staleBall).not.toBeInTheDocument();
        */
        });

        it('cmd + s 단축키 사용시, 코드가 최신 상태임을 알리는 UI가 렌더링 되어야 한다.', async () => {
          await act(async () => {
            await userEvent.keyboard('{Meta>}s{/Meta}');
          });

          const $saveCodeButton = screen.getByTestId<HTMLButtonElement>('save-code-button');
          const $staleBall = screen.queryByTestId('stale-ball');

          expect($staleBall).not.toBeInTheDocument();
          expect($saveCodeButton.disabled).toBe(true);
        });

        it('control + s 단축키 사용시, 코드가 최신 상태임을 알리는 UI가 렌더링 되어야 한다.', async () => {
          await act(async () => {
            await userEvent.keyboard('{Control>}s{/Control}');
          });

          const $saveCodeButton = screen.getByTestId<HTMLButtonElement>('save-code-button');
          const $staleBall = screen.queryByTestId('stale-ball');

          expect($saveCodeButton.disabled).toBe(true);
          expect($staleBall).not.toBeInTheDocument();
        });

        it('코드 저장 버튼 클릭 시, 코드가 최신 상태임을 알리는 UI가 렌더링 되어야 한다.', async () => {
          const $saveCodeButton = screen.getByTestId<HTMLButtonElement>('save-code-button');

          expect($saveCodeButton.disabled).toBe(false);

          await act(async () => {
            await userEvent.click($saveCodeButton);
          });

          const $staleBall = screen.queryByTestId('stale-ball');

          expect($saveCodeButton.disabled).toBe(true);
          expect($staleBall).not.toBeInTheDocument();
        });
      });

      describe('의도적이지 않은 코드 저장', () => {
        it('기본 코드로 저장 버튼 클릭 시, 코드가 최신 상태임을 알리는 UI가 렌더링 되어야 한다.', async () => {
          const $saveDefaultCodeButton = screen.getByTestId<HTMLButtonElement>('save-default-code-button');

          await act(async () => {
            await userEvent.click($saveDefaultCodeButton);
          });

          const $confirmOkButton = screen.getByTestId<HTMLButtonElement>('confirm-ok-button');

          await act(async () => {
            await userEvent.click($confirmOkButton);
          });

          const $saveCodeButton = screen.getByTestId<HTMLButtonElement>('save-code-button');
          const $staleBall = screen.queryByTestId('stale-ball');

          expect($saveCodeButton.disabled).toBe(true);
          expect($staleBall).not.toBeInTheDocument();
        });

        it('코드 제출 버튼 클릭 시, 코드가 최신 상태임을 알리는 UI가 렌더링 되어야 한다.', async () => {
          const $submitCodeButton = screen.getByTestId<HTMLButtonElement>('submit-code-button');

          await act(async () => {
            await userEvent.click($submitCodeButton);
          });

          const $confirmOkButton = screen.getByTestId<HTMLButtonElement>('confirm-ok-button');

          await act(async () => {
            await userEvent.click($confirmOkButton);
          });

          const $saveCodeButton = screen.getByTestId<HTMLButtonElement>('save-code-button');
          const $staleBall = screen.queryByTestId('stale-ball');

          expect($saveCodeButton.disabled).toBe(true);
          expect($staleBall).not.toBeInTheDocument();
        });

        it('코드 실행 버튼 클릭 시, 코드가 최신 상태임을 알리는 UI가 렌더링 되어야 한다.', async () => {
          const $executeCodeButton = screen.getByTestId<HTMLButtonElement>('execute-code-button');

          await act(async () => {
            await userEvent.click($executeCodeButton);
          });

          const $saveCodeButton = screen.getByTestId<HTMLButtonElement>('save-code-button');
          const $staleBall = screen.queryByTestId('stale-ball');

          expect($saveCodeButton.disabled).toBe(true);
          expect($staleBall).not.toBeInTheDocument();
        });

        it('F5 단축키로 코드 실행 시, 코드가 최신 상태임을 나타내는 UI가 렌더링 되어야 한다.', async () => {
          await act(async () => {
            const listener = clientChannelToListener['judge-request'];

            if (typeof listener === 'function') {
              const result = listener(undefined);

              if (result instanceof Promise) {
                await result;
              }
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
});
