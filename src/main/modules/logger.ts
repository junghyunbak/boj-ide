import { ipc } from '@/main/utils';

export class Logger {
  build() {
    ipc.on('log-add-testcase', () => {});
    ipc.on('log-execute-ai-create', () => {});
  }
}
