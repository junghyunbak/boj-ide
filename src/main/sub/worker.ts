import { spawnSync } from 'child_process';
import { parentPort } from 'worker_threads';
import { removeAnsiText } from '../../utils';
import { MAX_BUFFER_SIZE } from './judge';

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
  const start = Date.now();

  const { stderr, stdout, signal } = spawnSync(executeCmd, {
    cwd: basePath,
    input,
    shell: true,
    timeout: 6000,
    maxBuffer: MAX_BUFFER_SIZE,
  });

  const end = Date.now();

  return { signal, elapsed: end - start, stdout: removeAnsiText(stdout.toString()), stderr: stderr.toString() };
}

parentPort?.on('message', (data) => {
  const { executeCmd, input, basePath } = data;

  const { elapsed, stderr, stdout, signal } = execute({ executeCmd, input, basePath });

  parentPort?.postMessage({ stderr, stdout, elapsed, signal });
});
