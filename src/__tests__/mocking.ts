import { createMockProblem } from '@/renderer/mock';

/**
 * webview mocking
 */
export const webview = document.createElement('webview');

webview.loadURL = async () => {};
webview.getURL = () => '';

/**
 * problem mocking
 *
 * ⛔️️ 데이터는 에디터 코드 하이라이팅을 고려하여 공백과 특수문자를 사용하지 않으며, 같은 종류의 문자로 통일한다.
 */
export const problemA = createMockProblem({
  name: '문제A',
  number: '1000',
});

export const problemAData = '문제A데이터';

export const problemB = createMockProblem({
  name: '문제B',
  number: '2000',
});

export const problemBData = '문제B데이터';

/**
 * ipc event mocking
 */
type ClientChannelToListener = {
  [channel in ClientChannels]?: ((
    message: MessageTemplate<ChannelToMessage[channel][Receive]>,
  ) => void | Promise<void>)[];
};

export const clientChannelToListener: ClientChannelToListener = {};

export const electronChannelToIsReceived: { [channel in ElectronChannels]?: boolean } = {};

window.electron = {
  platform: 'win32',
  ipcRenderer: {
    once(channel, func) {},
    on(channel, listener) {
      if (!clientChannelToListener[channel]) {
        clientChannelToListener[channel] = [];
      }

      // BUG: 종속성이 바뀌어 콜백함수가 갱신되지만 쌓이는 구조를 지니고 있어 문제가 될 수 있다.
      clientChannelToListener[channel].push(listener);

      return () => {};
    },
    sendMessage(channel, message) {
      electronChannelToIsReceived[channel] = true;
    },
    async invoke(channel, message) {
      switch (channel) {
        case 'save-code':
          return { data: { isSaved: true } };
        case 'save-default-code':
          return { data: { isSaved: true } };
        case 'load-code': {
          const code = (() => {
            if (typeof message !== 'object') {
              return '';
            }

            if (!('data' in message) || !(typeof message.data === 'object') || !('number' in message.data)) {
              return '';
            }

            if (problemA.number === message.data.number) {
              return problemAData;
            }

            if (problemB.number === message.data.number) {
              return problemBData;
            }

            return '';
          })();

          return { data: { code } };
        }
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
          return { data: undefined };
      }
    },
  },
};
