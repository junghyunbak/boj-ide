import { parentPort } from 'worker_threads';

import { removeAnsiText, customSpawn } from '@/main/utils';

import { MAX_BUFFER_SIZE } from '@/main/constants';

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
