export const langToJudgeInfo: Record<Language, JudgeInfo> = {
  'C++17': {
    cli: 'g++',
    ext: {
      win32: 'cpp',
      darwin: 'cc',
    },
    compile: (fileName) => ({
      win32: `g++ ${fileName}.cpp -o ${fileName} -std=gnu++17 -O2 -Wall -lm -static`,
      darwin: `g++ ${fileName}.cc -o ${fileName} -std=c++17`,
    }),
    executeArgs: () => ({
      win32: [],
      darwin: [],
    }),
  },
  'C++14': {
    cli: 'g++',
    ext: {
      win32: 'cpp',
      darwin: 'cc',
    },
    compile: (fileName) => ({
      win32: `g++ ${fileName}.cpp -o ${fileName} -std=gnu++14 -O2 -Wall -lm -static`,
      darwin: `g++ ${fileName}.cc -o ${fileName} -std=c++14`,
    }),
    executeArgs: () => ({
      win32: [],
      darwin: [],
    }),
  },
  Java11: {
    cli: 'javac',
    ext: {
      win32: 'java',
      darwin: 'java',
    },
    program: 'java',
    compile: () => ({
      win32: 'javac --release 11 -J-Xms1024m -J-Xmx1920m -J-Xss512m -encoding UTF-8 Main.java',
      darwin: 'javac --release 11 -J-Xms1024m -J-Xmx1920m -J-Xss512m -encoding UTF-8 Main.java',
    }),
    executeArgs: () => ({
      win32: ['-Xms1024m', '-Xmx1920m', '-Xss512m', '-Dfile.encoding=UTF-8', '-XX:+UseSerialGC', 'Main'],
      darwin: ['-Xms1024m', '-Xmx1920m', '-Xss512m', '-Dfile.encoding=UTF-8', '-XX:+UseSerialGC', 'Main'],
    }),
  },
  'node.js': {
    ext: {
      win32: 'js',
      darwin: 'js',
    },
    cli: 'node',
    program: 'node',
    executeArgs: (fileName) => ({
      win32: [`${fileName}.js`],
      darwin: [`${fileName}.js`],
    }),
  },
  Python3: {
    ext: {
      win32: 'py',
      darwin: 'py',
    },
    cli: 'python3',
    program: 'python3',
    executeArgs: (fileName) => ({
      win32: ['-W', 'ignore', `${fileName}.py`],
      darwin: ['-W', 'ignore', `${fileName}.py`],
    }),
  },
};
