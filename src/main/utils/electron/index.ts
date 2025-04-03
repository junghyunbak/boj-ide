import { session } from 'electron';

import { BAKEJOONHUB_EXTENSION_PATH } from '@/main/constants';

import electronDevtoolsInstaller, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';

export const installExtensions = async (isDebug: boolean) => {
  /**
   * 백준 허브 확장 프로그램 설치
   */
  let baekjoonhubExtensionId: string = '';

  const { id } = await session.defaultSession.loadExtension(BAKEJOONHUB_EXTENSION_PATH);

  if (id) {
    baekjoonhubExtensionId = id;
  }

  /**
   * 개발자 도구 확장 프로그램 설치
   */
  if (isDebug) {
    await electronDevtoolsInstaller(REACT_DEVELOPER_TOOLS);
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
    details.requestHeaders['Sec-Fetch-Mode'] = 'navigate';

    callback({ cancel: false, requestHeaders: details.requestHeaders });
  });

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    const headers = details.responseHeaders;

    if (headers) {
      Object.keys(headers).forEach((key) => {
        if (key.toLowerCase() === 'access-control-allow-origin') {
          delete headers[key];
        }
      });

      headers['Access-Control-Allow-Origin'] = ['*'];
    }

    callback({ responseHeaders: headers });
  });
};
