type ChannelToMessage = {
  /**
   * electron
   */
  'load-code': MessageTemplate<MyOmit<CodeInfo, 'code'>>;
  'load-files': undefined;
  'save-code': MessageTemplate<CodeInfo & { silence?: boolean }>;
  'judge-start': MessageTemplate<CodeInfo & Pick<ProblemInfo, 'testCase'> & { judgeId: string }>;
  'submit-code': MessageTemplate<CodeInfo>;
  'open-source-code-folder': undefined;
  'open-deep-link': undefined;

  /**
   * client
   */
  'load-code-result': MessageTemplate<Pick<CodeInfo, 'code'>>;
  'load-files-result': MessageTemplate<{ problemNumbers: number[] }>;
  'save-code-result': MessageTemplate<SaveResult>;
  'judge-result': MessageTemplate<JudgeResult>;
  'judge-reset': undefined;
  'occur-error': MessageTemplate<{ message: string }>;
  'open-problem': MessageTemplate<{ problemNumber: number }>;
  'ctrl-r-pressed': undefined;
};

type ElectronChannels = keyof Pick<
  ChannelToMessage,
  | 'judge-start'
  | 'save-code'
  | 'load-code'
  | 'load-files'
  | 'open-source-code-folder'
  | 'submit-code'
  | 'open-deep-link'
>;

type ClientChannels = keyof Pick<
  ChannelToMessage,
  | 'load-code-result'
  | 'load-files-result'
  | 'judge-result'
  | 'save-code-result'
  | 'judge-reset'
  | 'occur-error'
  | 'open-problem'
  | 'ctrl-r-pressed'
>;
