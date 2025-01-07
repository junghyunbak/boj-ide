export const languageToExt = (language: Language) => {
  switch (language) {
    case 'node.js':
      return 'js';
    case 'C++14':
    case 'C++17':
      return 'cpp';
    case 'Java11':
      return 'java';
    case 'Python3':
      return 'py';
    default:
      return '';
  }
};
