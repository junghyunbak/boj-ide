export const ElECTRON_CHANNELS: {
  [P in ElectronChannels]: P;
} = {
  'load-code': 'load-code',
  'load-files': 'load-files',
  'save-code': 'save-code',
  'save-default-code': 'save-default-code',
  'judge-start': 'judge-start',
  'submit-code': 'submit-code',
  'open-source-code-folder': 'open-source-code-folder',
  'open-deep-link': 'open-deep-link',
  'log-add-testcase': 'log-add-testcase',
  'log-execute-ai-create': 'log-execute-ai-create',
  'log-toggle-paint': 'log-toggle-paint',
};

export const CLIENT_CHANNELS: {
  [P in ClientChannels]: P;
} = {
  'load-code-result': 'load-code-result',
  'load-files-result': 'load-files-result',
  'save-code-result': 'save-code-result',
  'judge-request': 'judge-request',
  'judge-result': 'judge-result',
  'judge-reset': 'judge-reset',
  'occur-error': 'occur-error',
  'open-problem': 'open-problem',
  'ctrl-or-cmd-r-pressed': 'ctrl-or-cmd-r-pressed',
  'set-baekjoonhub-id': 'set-baekjoonhub-id',
  'reload-webview': 'reload-webview',
  'app-update-info': 'app-update-info',
};
