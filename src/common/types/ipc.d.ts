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
  'load-code': [MyOmit<CodeInfo, 'code'>, Pick<CodeInfo, 'code'>];
  'load-files': [undefined, { problemNumbers: number[] }];
  'save-code': [CodeInfo, SaveResult];
  'save-default-code': [MyOmit<CodeInfo, 'number'>, SaveResult];
  'judge-start': [CodeInfo & Pick<ProblemInfo, 'testCase'> & { judgeId: string }];
  'stop-judge': [];
  'submit-code': [CodeInfo];
  'open-source-code-folder': [];
  'open-deep-link': [];
  'log-add-testcase': [MyOmit<CodeInfo, 'code'>];
  'log-execute-ai-create': [MyOmit<CodeInfo, 'code'>];
  'log-toggle-paint': [MyOmit<CodeInfo, 'code'>];
  'quit-app': [];
  'clipboard-copy-image': [{ dataUrl: string }, SaveResult];
  'toggle-theme': [{ theme: 'light' | 'dark' }];
  'create-random-problem': [
    { baekjoonId: string; tierRange: number[] },
    SolvedAC.API.SearchResponse['items'][number] | null,
  ];
  'search-problem': [{ query: string }, SolvedAC.API.SearchResponse['items']];
  'get-solved-tier': [{ problemId: string }, { level: number; title: string; tierBase64: string }];

  /**
   * client
   */
  'judge-result': [JudgeResult];
  'judge-reset': [];
  'judge-request': [];
  'occur-error': [{ message: string }];
  'open-problem': [{ problemNumber: number }];
  'ctrl-or-cmd-r-pressed': [];
  'set-baekjoonhub-id': [{ extensionId: string }];
  'reload-webview': [];
  'app-update-info': [{ bytesPerSecond?: number; percent?: number; isDownloaded: boolean }];
  'close-tab': [];
  'check-saved': [];
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
  | 'toggle-theme'
  | 'create-random-problem'
  | 'stop-judge'
  | 'search-problem'
  | 'get-solved-tier'
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
  | 'check-saved'
>;
