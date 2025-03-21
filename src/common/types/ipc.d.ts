/**
 * 클라이언트 기준
 */
type Send = 0;
type Receive = 1;

/**
 * key: 채널 이름
 * value: [전송 데이터, 응답 데이터(invoke의 경우만 존재)]
 */
type ChannelToMessage = {
  /**
   * electron
   */
  'load-code': [MessageTemplate<MyOmit<CodeInfo, 'code'>>, MessageTemplate<Pick<CodeInfo, 'code'>>];
  'load-files': [undefined, MessageTemplate<{ problemNumbers: number[] }>];
  'save-code': [MessageTemplate<CodeInfo>, MessageTemplate<SaveResult>];
  'save-default-code': [MessageTemplate<MyOmit<CodeInfo, 'number'>>, MessageTemplate<SaveResult>];
  'judge-start': [MessageTemplate<CodeInfo & Pick<ProblemInfo, 'testCase'> & { judgeId: string }>];
  'submit-code': [MessageTemplate<CodeInfo>];
  'open-source-code-folder': [];
  'open-deep-link': [];
  'log-add-testcase': [MessageTemplate<MyOmit<CodeInfo, 'code'>>];
  'log-execute-ai-create': [MessageTemplate<MyOmit<CodeInfo, 'code'>>];
  'log-toggle-paint': [MessageTemplate<MyOmit<CodeInfo, 'code'>>];
  'quit-app': [];
  'clipboard-copy-image': [MessageTemplate<{ dataUrl: string }>, MessageTemplate<SaveResult>];

  /**
   * client
   */
  'judge-result': [MessageTemplate<JudgeResult>];
  'judge-reset': [];
  'judge-request': [];
  'occur-error': [MessageTemplate<{ message: string }>];
  'open-problem': [MessageTemplate<{ problemNumber: number }>];
  'ctrl-or-cmd-r-pressed': [];
  'set-baekjoonhub-id': [MessageTemplate<{ extensionId: string }>];
  'reload-webview': [];
  'app-update-info': [MessageTemplate<{ bytesPerSecond?: number; percent?: number; isDownloaded: boolean }>];
  'close-tab': [];
};

type ElectronChannels = keyof Pick<
  ChannelToMessage,
  | 'judge-start'
  | 'save-code'
  | 'save-default-code'
  | 'load-code'
  | 'load-files'
  | 'open-source-code-folder'
  | 'submit-code'
  | 'open-deep-link'
  | 'log-add-testcase'
  | 'log-execute-ai-create'
  | 'log-toggle-paint'
  | 'quit-app'
  | 'clipboard-copy-image'
>;

type ClientChannels = keyof Pick<
  ChannelToMessage,
  | 'judge-reset'
  | 'judge-result'
  | 'judge-request'
  | 'open-problem'
  | 'occur-error'
  | 'ctrl-or-cmd-r-pressed'
  | 'set-baekjoonhub-id'
  | 'reload-webview'
  | 'app-update-info'
  | 'close-tab'
>;
