export const ElECTRON_CHANNELS: {
  [P in ElectronChannels]: P;
} = {
  'load-code': 'load-code',
  'load-files': 'load-files',
  'save-code': 'save-code',
  'judge-start': 'judge-start',
  'submit-code': 'submit-code',
  'open-source-code-folder': 'open-source-code-folder',
  'open-deep-link': 'open-deep-link',
};

export const CLIENT_CHANNELS: {
  [P in ClientChannels]: P;
} = {
  'load-code-result': 'load-code-result',
  'load-files-result': 'load-files-result',
  'save-code-result': 'save-code-result',
  'judge-result': 'judge-result',
  'judge-reset': 'judge-reset',
  'occur-error': 'occur-error',
  'open-problem': 'open-problem',
};
