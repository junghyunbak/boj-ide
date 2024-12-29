export function lang2Ext(lang: Language, platform: typeof process.platform = 'win32') {
  switch (lang) {
    case 'Java11':
      return 'java';
    case 'C++14':
    case 'C++17':
      return platform === 'win32' ? 'cpp' : 'cc';
    case 'node.js':
      return 'js';
    case 'Python3':
      return 'py';
    default:
      return '';
  }
}
