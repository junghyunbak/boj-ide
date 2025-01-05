import { parentPort } from 'worker_threads';

/**
 * @/main/constants, @/main/utils 와 같이 index 파일로 다시 export 하는 폴더구조를 import 할 경우
 * tree shaking이 실패할 수 있어 사용하길 원치 않는 모듈까지 import 할 수 있다.
 * worker는 독립적으로 실행되지 않으면 메인프로세스로 동작하여 parentPort가 null이 되어 정상적으로 동작하지 않기 때문에
 * 다른 모듈(예 - electron)을 import하지 않도록 사용하는 파일만 직접 import 하도록 작성한다.
 */
import { MAX_BUFFER_SIZE } from '@/main/constants/process';
import { customSpawn } from '@/main/utils/spawn';
import { removeAnsiText } from '@/main/utils/string';

type ExecuteResult = {
  stdout: string;
  stderr: string;
  signal: NodeJS.Signals | null;
  elapsed: number;
};

function execute({
  executeCmd,
  input,
  basePath,
}: {
  executeCmd: string;
  input: string;
  basePath: string;
}): ExecuteResult {
  const start = process.hrtime();

  const { stderr, stdout, signal } = customSpawn.sync(executeCmd, {
    cwd: basePath,
    input,
    shell: true,
    timeout: 6000,
    maxBuffer: MAX_BUFFER_SIZE,
  });

  const end = process.hrtime(start);

  return {
    signal,
    elapsed: Math.floor(end[1] / 1e6),
    stdout: removeAnsiText(stdout.toString()),
    stderr: removeAnsiText(stderr.toString()),
  };
}

if (!parentPort) {
  process.exit(1);
}

parentPort.on('message', (data) => {
  const { executeCmd, input, basePath } = data;

  const { elapsed, stderr, stdout, signal } = execute({ executeCmd, input, basePath });

  parentPort?.postMessage({ stderr, stdout, elapsed, signal });
});
