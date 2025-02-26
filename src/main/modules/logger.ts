import { ipc } from '@/main/utils';

import { sentryLogging } from '@/main/error';

export class Logger {
  build() {
    ipc.on('log-add-testcase', (e, { data: { number, language } }) => {
      sentryLogging('[로그] 사용자가 테스트케이스를 생성하였습니다.', {
        tags: {
          number,
          language,
        },
      });
    });

    ipc.on('log-execute-ai-create', (e, { data: { number, language } }) => {
      sentryLogging("[로그] 사용자가 'AI 입력 생성' 기능을 사용하였습니다.", {
        tags: {
          number,
          language,
        },
      });
    });

    ipc.on('log-toggle-paint', (e, { data: { number, language } }) => {
      sentryLogging('[로그] 사용자가 그림판을 버튼을 클릭하였습니다.', {
        tags: {
          number,
          language,
        },
      });
    });
  }
}
