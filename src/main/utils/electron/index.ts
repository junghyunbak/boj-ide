import { session } from 'electron';

import { BAKEJOONHUB_EXTENSION_PATH } from '@/main/constants';

import { sentryErrorHandler } from '@/main/error';

const electronDevtoolsInstaller = require('electron-devtools-installer');

export const installExtensions = async (isDebug: boolean) => {
  /**
   * 백준 허브 확장 프로그램 설치
   */
  let baekjoonhubExtensionId: string = '';

  const extensionId = await session.defaultSession
    .loadExtension(BAKEJOONHUB_EXTENSION_PATH)
    .then((extension) => extension.id)
    .catch(sentryErrorHandler);

  if (extensionId) {
    baekjoonhubExtensionId = extensionId;
  }

  /**
   * 개발자 도구 확장 프로그램 설치
   */
  if (isDebug) {
    const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
    const extensions = ['REACT_DEVELOPER_TOOLS'];

    electronDevtoolsInstaller
      .default(
        extensions.map((name) => electronDevtoolsInstaller[name]),
        forceDownload,
      )
      .catch(sentryErrorHandler);
  }

  return {
    baekjoonhubExtensionId,
  };
};

export const setWebRequest = () => {
  /**
   * 백준 허브 확장 프로그램에서 백준 문제 정보를 가져오기 위한 요청을 보낼 때,
   * 백준 페이지 정보를 올바르게 가져오기 위한 기본 요청 헤더를 수정함.
   */
  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    details.requestHeaders['Sec-Fetch-Dest'] = 'document';

    callback({ cancel: false, requestHeaders: details.requestHeaders });
  });
};
