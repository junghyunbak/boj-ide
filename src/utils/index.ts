export function normalizeOutput(output: string) {
  return output
    .trim()
    .split('\n')
    .map((line: string) => line.trim())
    .join('\n');
}

export function lang2Tool(lang: Langauge) {
  switch (lang) {
    case 'C++14':
      return 'g++';
    case 'Java11':
      return 'javac';
    case 'node.js':
      return 'node';
    case 'Python3':
      return 'python3';
    default:
      return '';
  }
}

export function lang2Ext(lang: Langauge, platform: typeof process.platform = 'win32') {
  switch (lang) {
    case 'Java11':
      return 'java';
    case 'C++14':
      return platform === 'win32' ? 'cpp' : 'cc';
    case 'node.js':
      return 'js';
    case 'Python3':
      return 'py';
    default:
      return '';
  }
}

export function lang2BuildCmd(lang: Langauge, fileName: string, platform: typeof process.platform) {
  switch (lang) {
    case 'C++14':
      return platform === 'win32'
        ? `${lang2Tool(lang)} ${fileName}.${lang2Ext(lang, platform)} -o ${fileName} -std=gnu++14 -O2 -Wall -lm -static`
        : `${lang2Tool(lang)} ${fileName}.${lang2Ext(lang, platform)} -o ${fileName} -std=c++14`;
    case 'Java11':
      return `javac --release 11 -J-Xms1024m -J-Xmx1920m -J-Xss512m -encoding UTF-8 Main.java`;
    default:
      return '';
  }
}

export function lang2BinExt(lang: Langauge, platform: typeof process.platform) {
  switch (lang) {
    case 'C++14':
      return platform === 'win32' ? '.exe' : '';
    case 'Java11':
      return 'Main';
    default:
      return '';
  }
}

export function lang2ExecuteCmd(lang: Langauge, buildFileName: string, platform: typeof process.platform) {
  switch (lang) {
    case 'C++14':
      return (platform === 'win32' ? '' : './') + buildFileName;
    case 'node.js':
      return `node ${buildFileName}`;
    case 'Python3':
      return `python3 -W ignore ${buildFileName}`;
    case 'Java11':
      return `java -Xms1024m -Xmx1920m -Xss512m -Dfile.encoding=UTF-8 -XX:+UseSerialGC ${buildFileName}`;
    default:
      return '';
  }
}

export const stdinCmd = (platform: typeof process.platform, fileName: string) => {
  switch (platform) {
    case 'win32':
      return `type ${fileName}`;
    default:
      return `cat ${fileName}`;
  }
};

export const isContainVersion = (text: string) => /[0-9]+\.[0-9]+\.[0-9]+/.test(text);

/**
 * 자주 사용되지 않는 정규식이라고 에러를 발생시키는 것이므로 비활성화해도 상관없다고 판단.
 *
 * https://stackoverflow.com/questions/49743842/javascript-unexpected-control-characters-in-regular-expression
 */
// eslint-disable-next-line no-control-regex
export const removeAnsiText = (text: string) => text.replace(/\x1B\[[0-?]*[ -/]*[@-~]/g, '');
