import App from '@/renderer/App';
import { act } from 'react';
import { useModifyTab, useModifyWebview } from '@/renderer/hooks';
import { createMockProblem } from '@/renderer/mock';
import { render, screen, renderHook } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

const mockProblem = createMockProblem({
  name: 'A + B',
  number: '1000',
});

beforeEach(() => {
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
  it('문제가 초기화되면 에디터가 활성화 되어야 한다.', async () => {
    render(<App />);

    const tabEl = screen.getByText('1000번: A + B');

    await act(async () => {
      await userEvent.click(tabEl);
    });

    expect(screen.getByText('에디터로딩완료')).toBeInTheDocument();
  });

  // TEST: 수정 후 문제전환
  // TEST: 수정 없이 문제전환
});
